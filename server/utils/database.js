const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true
  }
});

// Prueba de conexión directa
pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

cloudinary.config({
  cloud_name: 'dqy0f7skk',
  api_key: '626754323673753',
  api_secret: 'eZMydSf0i92LcK3EOdmgwMAEUbU'
});

// Función para obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el primer usuario encontrado
  } catch (error) {
    console.error('Error al obtener el usuario por correo electrónico:', error);
    throw error;
  }
};

// Función para crear un nuevo usuario
const createUser = async (email, password) => {
  try {
    // Se incluye el campo 'role' en la consulta y se asigna 'user' como valor predeterminado
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)';
    // 'user' se pasa como tercer argumento en el arreglo de valores
    await pool.query(query, [email, password, 'user']);
  } catch (error) {
    console.error('Error al crear un nuevo usuario:', error);
    throw error;
  }
};

// Función para crear un nuevo empleado
const createemployee = async (email, password, nombre, apellido, cargo, role) => {
  try {
    // Se incluye el campo 'role' en la consulta
    const query = 'INSERT INTO employee (email, password, nombre, apellido, cargo, role) VALUES ($1, $2, $3, $4, $5, $6)';
    // Se pasa 'role' como sexto argumento en el arreglo de valores
    await pool.query(query, [email, password, nombre, apellido, cargo, role]);
  } catch (error) {
    console.error('Error al crear un nuevo empleado:', error);
    throw error;
  }
};

// Función para obtener un empleado por correo electrónico
const getEmpleadoByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM employee WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Devuelve el primer empleado encontrado
  } catch (error) {
    console.error('Error al obtener el empleado por correo electrónico:', error);
    throw error;
  }
};

// Función para actualizar la contraseña del usuario en la base de datos
async function updateUserPassword(userId, newPassword) {
  try {
    const query = 'UPDATE users SET password = $1 WHERE id = $2';
    await pool.query(query, [newPassword, userId]);
  } catch (error) {
    throw new Error('Error al actualizar la contraseña del usuario');
  }
}

// Función para insertar un proveedor y crear la tabla si no existe
async function insertarProveedor(nombre, email, telefono) {
  const createTableQuery = "CREATE TABLE IF NOT EXISTS proveedores (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(20))";
  const insertQuery = `INSERT INTO proveedores (name, email, phone) VALUES ($1, $2, $3)`;

  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Error al crear la tabla de proveedores:', error);
  }

  try {
    await pool.query(insertQuery, [nombre, email, telefono]);
  } catch (error) {
    console.error('Error al insertar el proveedor:', error);
  }
}

const obtenerProveedores = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM proveedores');
    return result.rows;
  } finally {
    client.release();
  }
}

// Función para obtener un proveedor por su ID
const obtenerProveedorPorId = async (idProveedor) => {
  try {
    const query = 'SELECT * FROM proveedores WHERE id = $1'; // Utiliza un parámetro de consulta para evitar SQL injection
    const { rows } = await pool.query(query, [idProveedor]);
    // Si no se encuentra ningún proveedor con el ID dado, retorna null
    if (rows.length === 0) {
      return null;
    }
    // Devuelve el primer proveedor encontrado (debería ser único ya que el ID es único)
    return rows[0];
  } catch (error) {
    console.error('Error al obtener el proveedor por ID:', error);
    throw error;
  }
};

// Función para crear la tabla de categorías
async function crearTablaCategorias() {
  const query = 'CREATE TABLE categorias (category_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
  await pool.query(query);
}

// Función para insertar categorías de ejemplo
async function insertarCategorias() {
  const query = "INSERT INTO categorias (name, description) VALUES ('Decoración de fiestas', 'Productos para decorar fiestas y celebraciones'), ('Accesorios para photocall', 'Accesorios divertidos para sesiones de fotos'), ('Artículos para eventos especiales', 'Productos para eventos temáticos y especiales')";
  await pool.query(query);
}

const obtenerCategorias = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM categorias');
    return result.rows; // Se asume que la tabla se llama 'categorias'
  } finally {
    client.release();
  }
};

// Función para crear la tabla de productos
async function crearTablaProductos() {
  const query = 'CREATE TABLE productos (product_id SERIAL PRIMARY KEY, category_id INTEGER REFERENCES categorias(category_id),name VARCHAR(100) NOT NULL, description TEXT, price NUMERIC(8,2) NOT NULL, stock INTEGER NOT NULL, image_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
  await pool.query(query);
}

// Función para crear un nuevo producto
async function insertarProducto(category_id, name, description, price, stock, image_url) {
  const query = 'INSERT INTO productos (category_id, provide_id, name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [category_id, name, description, price, stock, image_url];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Devuelve el primer registro insertado
}

// Función para agregar una orden de compra
async function insertaOrden(provider_id, orderItems, date) {
  try {
    // Verificar si la tabla de orders existe, y si no existe, crearla
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        provider_id INT NOT NULL,
        products JSONB NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (provider_id) REFERENCES proveedores(id)
      );
    `);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let orderIds = [];
      for (const orderItem of orderItems) {
        const { product_id, quantity } = orderItem;
        const query = 'INSERT INTO orders (provider_id, products, date) VALUES ($1, $2, $3) RETURNING order_id';
        const values = [provider_id, JSON.stringify(orderItem), date];
        const result = await client.query(query, values);
        orderIds.push(result.rows[0].order_id);
      }
      await client.query('COMMIT');
      return orderIds;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    throw error;
  }
}


const obtenerOrdenPorId = async (idOrden) => {
  try {
    const query = 'SELECT * FROM orders WHERE id = $1'; // Utiliza un parámetro de consulta para evitar SQL injection
    const { rows } = await pool.query(query, [idOrden]);
    // Si no se encuentra ninguna orden con el ID dado, retorna null
    if (rows.length === 0) {
      return null;
    }
    // Devuelve la primera orden encontrada (debería ser única ya que el ID es único)
    return rows[0];
  } catch (error) {
    console.error('Error al obtener la orden por ID:', error);
    throw error;
  }
};

const obtenerOrdenesCompra = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM orders');
    return result.rows;
  } finally {
    client.release();
  }
};

// Función para obtener una página de productos paginados
const obtenerProductosPorPagina = async (pagina, productosPorPagina) => {
  try {
    const offset = (pagina - 1) * productosPorPagina;
    const query = `SELECT * FROM productos ORDER BY product_id OFFSET $1 LIMIT $2`;
    const { rows } = await pool.query(query, [offset, productosPorPagina]);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de productos por página:', error);
    throw error;
  }
};

// Función para obtener todos los productos sin paginación
const obtenerTodosLosProductos = async () => {
  try {
    const query = `SELECT * FROM productos ORDER BY product_id`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de todos los productos:', error);
    throw error;
  }
};

// Función para obtener productos por categoria
const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const query = `SELECT * FROM productos WHERE category_id = $1`;
    const { rows } = await pool.query(query, [categoria]);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de productos por categoría:', error);
    throw error;
  }
};

// Función para obtener productos con stock menor que 10
const obtenerProductosConStockMenorQue10 = async () => {
  try {
    const query = 'SELECT * FROM productos WHERE stock < 10';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener la lista de productos con stock menor que 10:', error);
    throw error;
  }
};

// Función para obtener los productos más recientes
const obtenerProductosRecientes = async (limit) => {
  try {
    const query = `SELECT * FROM productos ORDER BY created_at DESC LIMIT ${limit}`;
    const { rows } = await pool.query(query);

    return rows;
  } catch (error) {
    console.error('Error al obtener los productos recientes:', error);
    throw error;
  }
};

// Función para actualizar un producto por su ID
const actualizarProducto = async (idProducto, camposActualizados) => {
  const { category_id, name, description, price, stock, image_url } = camposActualizados;
  try {
    const query = 'UPDATE productos SET category_id = $1, name = $2, description = $3, price = $4, stock = $5, image_url = $6 WHERE product_id = $7';
    await pool.query(query, [category_id, name, description, price, stock, image_url, idProducto]);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

// Función para actualizar un proveedor por su ID
const actualizarProveedor = async (idProveedor, camposActualizados) => {
  const { name, email, phone } = camposActualizados;
  try {
    const query = 'UPDATE proveedores SET name = $1, email = $2, phone = $3 WHERE id = $4';
    await pool.query(query, [name, email, phone, idProveedor]);
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    throw error;
  }
};

// Función para eliminar un producto por su ID
const eliminarProducto = async (idProducto) => {
  try {
    const query = 'DELETE FROM productos WHERE product_id = $1';
    await pool.query(query, [idProducto]);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};

// Función para eliminar un proveedor por su ID
const eliminarProveedor = async (idProveedor) => {
  try {
    const query = 'DELETE FROM proveedores WHERE id = $1';
    await pool.query(query, [idProveedor]);
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    throw error;
  }
};

// Función para obtener un producto por su ID
const obtenerProductoPorId = async (idProducto) => {
  try {
    const query = 'SELECT * FROM productos WHERE product_id = $1'; // Utiliza un parámetro de consulta para evitar SQL injection
    const { rows } = await pool.query(query, [idProducto]);
    // Si no se encuentra ningún producto con el ID dado, retorna null
    if (rows.length === 0) {
      return null;
    }
    // Devuelve el primer producto encontrado (debería ser único ya que el ID es único)
    return rows[0];
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const email = 'admin@admin.com';
    const password = 'party20and24gift';
    const nombre = 'admin';
    const apellido = 'admin';
    const cargo = 'admin';
    const role = 'admin';

    // Check if the admin user already exists
    const existingAdmin = await pool.query('SELECT * FROM employee WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      console.log('El usuario administrador predeterminado ya existe');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the default admin user
    const query = 'INSERT INTO employee (email, password, nombre, apellido, cargo, role) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(query, [email, hashedPassword, nombre, apellido, cargo, role]);

    console.log('Usuario administrador predeterminado creado con éxito');
  } catch (error) {
    console.error('Error al crear el usuario administrador predeterminado:', error);
  }
};

// Función para crear envio de pedido
const createaddress = async (nombre, apellido, direccion, ciudad, email, telefono, id_orders) => {
  try {
    const query = 'INSERT INTO addresses (nombre, apellido, direccion, ciudad, email, telefono, id_orders) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(query, [nombre, apellido, direccion, ciudad, email, telefono, id_orders]);
  } catch (error) {
    console.error('Error al enviar la direccion de pedido:', error);
    throw error;
  }
};

// Función para insertar un producto en el carrito
const agregarAlCarrito = async (userId, productId, quantity) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    let cartId;
    if (cartRows.length === 0) {
      // Si el carrito no existe, crea uno nuevo
      const createCartQuery = 'INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id';
      const { rows: newCartRows } = await pool.query(createCartQuery, [userId]);
      cartId = newCartRows[0].cart_id;
    } else {
      cartId = cartRows[0].cart_id;
    }

    // Inserta el producto en el carrito
    const insertQuery = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, (SELECT price FROM productos WHERE product_id = $2))';
    await pool.query(insertQuery, [cartId, productId, quantity]);
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    throw error;
  }
};

const obtenerCarritoPorUsuario = async (userId) => {
  try {
    const query = `
      SELECT ci.item_id, ci.quantity, p.product_id, p.name, p.description, p.price, p.image_url,
             a.address_line1, a.address_line2, a.city, a.postal_code, a.phone
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.cart_id
      JOIN productos p ON ci.product_id = p.product_id
      LEFT JOIN addresses a ON c.user_id = a.user_id
      WHERE c.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener el carrito por usuario:', error);
    throw error;
  }
};

const guardarDireccionUsuario = async (userId, direccion) => {
  try {
    const { address_line1, address_line2, city, postal_code, phone } = direccion;
    const query = `
      INSERT INTO addresses (user_id, address_line1, address_line2, city, postal_code, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE
      SET address_line1 = $2, address_line2 = $3, city = $4, postal_code = $5, phone = $6
      RETURNING *;
    `;
    const values = [userId, address_line1, address_line2, city, postal_code, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al guardar la dirección del usuario:', error);
    throw error;
  }
};

// Función para obtener la dirección del usuario
async function obtenerDireccionUsuario(userId) {
  try {
    const query = 'SELECT * FROM addresses WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null; // Devuelve la dirección del usuario o null si no se encuentra
  } catch (error) {
    console.error('Error al obtener la dirección del usuario:', error);
    throw error;
  }
}


const actualizarDireccionUsuario = async (userId, direccion) => {
  try {
    const { address_line1, address_line2, city, postal_code, phone } = direccion;
    const query = `
      UPDATE addresses
      SET address_line1 = $1, address_line2 = $2, city = $3, postal_code = $4, phone = $5
      WHERE user_id = $6
      RETURNING address_line1, address_line2, city, postal_code, phone;
    `;
    const values = [address_line1, address_line2, city, postal_code, phone, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la dirección del usuario:', error);
    throw error;
  }
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = async (userId, itemId) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    if (cartRows.length === 0) {
      throw new Error('El carrito no existe para este usuario');
    }

    const cartId = cartRows[0].cart_id;

    // Elimina el producto del carrito
    const deleteQuery = 'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2';
    await pool.query(deleteQuery, [cartId, itemId]);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    throw error;
  }
};


// Función para actualizar la cantidad de un producto en el carrito
const actualizarCantidadEnCarrito = async (userId, itemId, newQuantity) => {
  try {
    // Verifica si el carrito existe para el usuario
    const cartQuery = 'SELECT cart_id FROM cart WHERE user_id = $1';
    const { rows: cartRows } = await pool.query(cartQuery, [userId]);

    if (cartRows.length === 0) {
      throw new Error('El carrito no existe para este usuario');
    }

    const cartId = cartRows[0].cart_id;

    // Actualiza la cantidad del producto en el carrito
    const updateQuery = 'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND item_id = $3';
    await pool.query(updateQuery, [newQuantity, cartId, itemId]);
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    throw error;
  }
};

// Función para eliminar el carrito de un usuario
async function eliminarCarritoUsuario(userId) {
  try {
    const query = 'DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)';
    await pool.query(query, [userId]);
  } catch (error) {
    console.error('Error al eliminar el carrito del usuario:', error);
    throw error;
  }
}

const obtenerCarritoPorUsuarioStripe = async (userId) => {
  try {
    const query = `
      SELECT ci.item_id, ci.quantity, ci.price
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.cart_id
      WHERE c.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener el carrito por usuario:', error);
    throw error;
  }
};


// Función para crear una nueva orden
async function crearOrden(userId) {
  try {
    // Obtener los productos del carrito del usuario
    const cartItems = await obtenerCarritoPorUsuarioStripe(userId);
    if (cartItems.length === 0) {
      console.log('El carrito está vacío');
    }
    console.log(cartItems);


    // Obtener la dirección del usuario
    const address = await obtenerDireccionUsuario(userId);

    // Calcular el subtotal y el total con impuestos
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    console.log('Subtotal de la orden:', subtotal);
    console.log('Impuesto (12%):', tax);
    console.log('Total de la orden:', total);

    // Crear una nueva orden en la tabla "Orders"
    const query = 'INSERT INTO orders (user_id, cart_id, address_id, total, created_at) VALUES ($1, (SELECT cart_id FROM cart WHERE user_id = $1), $2, $3, NOW()) RETURNING *';
    const values = [userId, address ? address.id : null, total];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
}

// Función para obtener el historial de órdenes de un usuario
async function obtenerOrdenesUsuario(userId) {
  try {
    const query = `
      SELECT
        o.order_id,
        o.created_at,
        CAST(o.total AS DECIMAL(10,2)) AS total,
        o.status
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener el historial de órdenes:', error);
    throw error;
  }
}

const obtenerOrdenesVentas = async () => {
  try {
    const query = `
      SELECT
        o.order_id,
        o.created_at,
        CAST(o.total AS DECIMAL(10,2)) AS total,
        o.status
      FROM orders o
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener el historial de órdenes:', error);
    throw error;
  }
}



// Función para obtener los detalles de una orden
async function obtenerDetallesOrden(userId, orderId) {
  try {
    const query = `
      SELECT
        o.order_id,
        o.created_at,
        o.total,
        o.status,
        ci.quantity,
        p.name,
        p.price,
        p.image_url
      FROM orders o
      JOIN cart_items ci ON o.cart_id = ci.cart_id
      JOIN productos p ON ci.product_id = p.product_id
      WHERE o.user_id = $1 AND o.order_id = $2
    `;
    const { rows } = await pool.query(query, [userId, orderId]);

    if (rows.length === 0) {
      return null;
    }

    // Agrupar los detalles de la orden por producto
    const orderDetails = rows.reduce((acc, row) => {
      const existingProduct = acc.find((item) => item.name === row.name);
      if (existingProduct) {
        existingProduct.quantity += row.quantity;
      } else {
        acc.push({
          name: row.name,
          price: row.price,
          quantity: row.quantity,
          image_url: row.image_url
        });
      }
      return acc;
    }, []);

    return {
      id: rows[0].order_id,
      created_at: rows[0].created_at,
      total: rows[0].total,
      status: rows[0].status,
      products: orderDetails
    };
  } catch (error) {
    console.error('Error al obtener los detalles de la orden:', error);
    throw error;
  }
}

async function obtenerDetallesOrdenSales() {
  try {
    const query = `
      SELECT
        o.order_id,
        o.created_at,
        o.total,
        o.status,
        ci.quantity,
        p.name,
        p.price,
        p.image_url
      FROM orders o
      JOIN cart_items ci ON o.cart_id = ci.cart_id
      JOIN productos p ON ci.product_id = p.product_id
     
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return null;
    }

    // Agrupar los detalles de la orden por producto
    const orderDetails = rows.reduce((acc, row) => {
      const existingProduct = acc.find((item) => item.name === row.name);
      if (existingProduct) {
        existingProduct.quantity += row.quantity;
      } else {
        acc.push({
          name: row.name,
          price: row.price,
          quantity: row.quantity,
          image_url: row.image_url
        });
      }
      return acc;
    }, []);

    return {
      id: rows[0].order_id,
      created_at: rows[0].created_at,
      total: rows[0].total,
      status: rows[0].status,
      products: orderDetails
    };
  } catch (error) {
    console.error('Error al obtener los detalles de la orden:', error);
    throw error;
  }
}

// Función para eliminar un usuario por su ID
const eliminarUsuario = async (userId) => {
  try {
    const query = 'DELETE FROM users WHERE user_id = $1';
    await pool.query(query, [userId]);
  } catch (error) {
    console.error('Error al eliminar us usuario:', error);
    throw error;
  }
};

// Función para eliminar un usuario por ID
const deleteUserById = async (userId) => {
  try {
    const query = 'DELETE FROM public.users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rowCount; // Retorna el número de filas afectadas
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
};


module.exports = {
  getUserByEmail,
  getEmpleadoByEmail,
  createemployee,
  createUser,
  updateUserPassword,
  crearTablaCategorias,
  insertarCategorias,
  obtenerCategorias,
  insertarProveedor,
  obtenerProveedores,
  obtenerProveedorPorId,
  actualizarProveedor,
  eliminarProveedor,
  crearTablaProductos,
  insertarProducto,
  obtenerProductosPorPagina,
  obtenerTodosLosProductos,
  createDefaultAdmin,
  obtenerProductoPorId,
  actualizarProducto,
  createaddress,
  eliminarProducto,
  agregarAlCarrito,
  obtenerCarritoPorUsuario,
  guardarDireccionUsuario,
  obtenerDireccionUsuario,
  actualizarDireccionUsuario,
  obtenerProductosPorCategoria,
  obtenerProductosRecientes,
  obtenerProductosConStockMenorQue10,
  eliminarDelCarrito,
  actualizarCantidadEnCarrito,
  eliminarCarritoUsuario,
  insertaOrden,
  obtenerOrdenesCompra,
  obtenerOrdenPorId,
  crearOrden,
  obtenerOrdenesUsuario,
  obtenerDetallesOrden,
  obtenerDetallesOrdenSales,
  obtenerOrdenesVentas,
  eliminarUsuario,
  deleteUserById,
};