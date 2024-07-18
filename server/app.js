// Importar las dependencias necesarias
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import tableRoute from './routes/tableRoute.js';
import sqlRoute from './routes/sqlRoute.js';

const app = express();
const port = 3000;

// Configura CORS para permitir todas las solicitudes
app.use(cors());

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Middleware para analizar solicitudes codificadas en URL
app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/users', userRoute);
app.use('/tables', tableRoute);
app.use('/sql', sqlRoute); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



/*

const bcrypt = require('bcrypt');
const db = require('./utils/database');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51P0kZtL1xMfPwf6dWCmv8wAoaHc4o01CBOAMWhBz1rm4vk4NDLoJN0Zpf6wGRgRB1LPREQ61OEdA9LoiUkZhf3MR00VJ4sno7M');




app.use(cors({
  origin: '*', // Use the environment variable
  methods: ['GET', 'POST', 'PUT', 'DELETE'],        // Allow specific methods
  credentials: true                 // To allow sending of cookies
}));

// Route for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Search for the user in the database
  const user = await db.getUserByEmail(email);
  if (!user) {
    return res.status(401).send('User not found');
  }
  // Check the password
  if (bcrypt.compareSync(password, user.password)) {
    let token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '7d' });
    return res.json({ message: 'Successful login', token: token });
  } else {
    return res.status(401).send('Incorrect email or password');
  }
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dqy0f7skk',
  api_key: '626754323673753',
  api_secret: 'eZMydSf0i92LcK3EOdmgwMAEUbU'
});

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // Comprueba si el usuario ya existe en la base de datos
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).send('El correo electrónico ya está en uso');
  }

  // Crea un nuevo usuario
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.createUser(email, hashedPassword);
  return res.send('Usuario registrado exitosamente');
});

// Ruta de registro empleado
app.post('/register/empleado', async (req, res) => {
  const { email, password, nombre, apellido, cargo, role } = req.body; // Se obtiene también el campo 'role' del cuerpo de la solicitud

  // Comprueba si el empleado ya existe en la base de datos
  const existingEmpleado = await db.getEmpleadoByEmail(email);
  if (existingEmpleado) {
    return res.status(400).send('El correo electrónico ya está en uso');
  }

  // Crea un nuevo empleado
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.createemployee(email, hashedPassword, nombre, apellido, cargo, role); // Se pasa el campo 'role' a la función createemployee
  return res.send('Empleado registrado exitosamente');
});


// Ruta para el inicio de sesión de empleados
app.post('/login/empleado', async (req, res) => {
  const { email, password } = req.body;
  // Busca el empleado en la base de datos
  const empleado = await db.getEmpleadoByEmail(email);
  if (!empleado) {
    return res.status(401).send('Empleado no encontrado');
  }
  // Comprueba la contraseña
  if (bcrypt.compareSync(password, empleado.password)) {
    let token = jwt.sign({ id: empleado.id, role: empleado.role }, 'secret key');
    return res.json({ message: 'Inicio de sesión de empleado exitoso', token: token });
  } else {
    return res.status(401).send('Correo electrónico o contraseña incorrectos');
  }
});

//Ruta para obtener los proveedores
app.get('/providers', async (req, res) => {
  try {
    const proveedores = await db.obtenerProveedores();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).send('Error al obtener proveedores');
  }
});

//Ruta para agregar proveedores
app.post('/providers', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    await db.insertarProveedor(nombre, email, telefono);
    res.status(201).json({ message: 'Proveedor agregado correctamente' }); // Devolver un objeto JSON con el mensaje de éxito
  } catch (error) {
    console.error('Error al insertar proveedor:', error);
    res.status(500).json({ message: 'Error al insertar proveedor' }); // Devolver un objeto JSON con el mensaje de error
  }
});

// Ruta para obtener un proveedor por su ID
app.get('/providers/:id', async (req, res) => {
  const providerId = req.params.id;

  try {
    // Busca el proveedor en la base de datos por su ID
    const provider = await db.obtenerProveedorPorId(providerId);

    // Verifica si el proveedor existe
    if (!provider) {
      return res.status(404).send('Proveedor no encontrado');
    }

    // Si el proveedor existe, lo devuelve en la respuesta
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un proveedor por su ID
app.put('/providers/:id', async (req, res) => {
  const providerId = req.params.id;
  const { name, email, phone } = req.body;

  try {
    // Verifica si el proveedor con el ID dado existe
    const existingProvider = await db.obtenerProveedorPorId(providerId);
    if (!existingProvider) {
      return res.status(404).send('Proveedor no encontrado');
    }

    // Actualiza el proveedor en la base de datos
    await db.actualizarProveedor(providerId, {
      name: name || existingProvider.name,
      email: email || existingProvider.email,
      phone: phone || existingProvider.phone
    });
    res.status(200).send('Proveedor actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un proveedor
app.delete('/providers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.eliminarProveedor(id);
    res.send(`Proveedor con id ${id} eliminado`);
  } catch (error) {
    res.status(500).send('Error al eliminar el proveedor');
  }
});

// Ruta para obtener todas las categorías
app.get('/categories', async (req, res) => {
  try {
    const categorias = await db.obtenerCategorias();
    res.status(200).json(categorias); // Devuelve todas las categorías
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para registrar un nuevo producto
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/products', upload.single('image'), async (req, res) => {
  const { category_id, name, description, price, stock } = req.body;
  const image = req.file;

  try {
    const result = await cloudinary.uploader.upload(image.path);
    const image_url = result.secure_url;

    const producto = await db.insertarProducto(category_id, name, description, price, stock, image_url);

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un producto por su ID
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Verifica si el producto con el ID dado existe
    const existingProduct = await db.obtenerProductoPorId(productId);
    if (!existingProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    // Elimina el producto de la base de datos
    await db.eliminarProducto(productId);

    res.status(200).send('Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Busca el producto en la base de datos por su ID
    const product = await db.obtenerProductoPorId(productId);

    // Verifica si el producto existe
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // Si el producto existe, lo devuelve en la respuesta
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un producto por su ID
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { category_id, name, description, price, stock, image_url } = req.body;

  try {
    // Verifica si el producto con el ID dado existe
    const existingProduct = await db.obtenerProductoPorId(productId);
    if (!existingProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    // Actualiza el producto en la base de datos
    await db.actualizarProducto(productId, {
      category_id: category_id || existingProduct.category_id,
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      stock: stock || existingProduct.stock,
      image_url: image_url || existingProduct.image_url
    });
    res.status(200).send('Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener los 10 productos registrados o agregados recientemente
app.get('/recent-products', async (req, res) => {
  try {
    // Obtiene los 10 productos más recientes de la base de datos
    const recentProducts = await db.obtenerProductosRecientes(10);

    res.status(200).send(recentProducts);
  } catch (error) {
    console.error('Error al obtener los productos recientes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener todos los productos de una categoría
app.get('/products/category/:category_id', async (req, res) => {
  const categoryId = req.params.category_id;

  if (!categoryId) {
    return res.status(400).json({ error: 'ID de categoría no proporcionado' });
  }

  try {
    const productos = await db.obtenerProductosPorCategoria(categoryId);

    if (!productos || productos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para la categoría especificada' });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).send('Error al obtener los productos por categoría');
  }
});

// Ruta para el envio del formulario del producto
app.post('/register/product', async (req, res) => {
  const { category_id, name, description, price, stock, image_url } = req.body;

  try {
    // Crea un nuevo producto en la base de datos
    const producto = await db.insertarProducto(category_id, name, description, price, stock, image_url);

    res.status(201).json(producto); // Devuelve el producto creado
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para agregar una orden de compra
app.post('/purchase-orders', async (req, res) => {
  const { provider_id, products, date } = req.body;

  try {
    const orderIds = await db.insertaOrden(provider_id, products, date);
    res.status(201).json(orderIds);
  } catch (error) {
    console.error('Error adding the order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Ruta para obtener las ordenes de compra
app.get('/purchase-orders', async (req, res) => {
  try {
    // Obtiene los 10 productos más recientes de la base de datos
    const orders = await db.obtenerOrdenesCompra();

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener las ordenes de compra:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener una orden de compra por su ID
app.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    // Busca la orden en la base de datos por su ID
    const order = await db.obtenerOrdenPorId(orderId);

    // Verifica si la orden existe
    if (!order) {
      return res.status(404).send('Orden no encontrada');
    }

    // Si la orden existe, la devuelve en la respuesta
    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// // Ruta para cambiar la contraseña del usuario
// app.post('/change-password', authenticateToken, async (req, res) => {
//   const { newPassword } = req.body;
//   const userId = req.user.id; // Obtener el ID del usuario del token

//   // Actualizar la contraseña en la base de datos
//   const hashedPassword = bcrypt.hashSync(newPassword, 10);
//   await db.updateUserPassword(userId, hashedPassword);

//   res.send('Contraseña cambiada exitosamente');
// });

// Ruta para obtener la lista de productos
const ITEMS_PER_PAGE = 5;
app.get('/page_product_list', async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;

  try {
    const products = await db.obtenerProductosPorPagina(page, ITEMS_PER_PAGE);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

// Ruta para obtener la lista de productos
app.get('/product-list', async (req, res) => {
  try {
    const products = await db.obtenerTodosLosProductos();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

// Ruta para obtener la lista de productos con stock menor que 10
app.get('/low-stock-products', async (req, res) => {
  try {
    const lowStockProducts = await db.obtenerProductosConStockMenorQue10();
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error al obtener la lista de productos con stock menor que 10:', error);
    res.status(500).send('Error al obtener la lista de productos con stock menor que 10');
  }
});

// Ruta para registrar la direccion de pedido
app.post('/order_address', async (req, res) => {
  const { nombre, apellido, direccion, ciudad, email, telefono, id_orders } = req.body;

  try {
    // Crea una nueva direccion para el pedido en la base de datos
    await db.createaddress(nombre, apellido, direccion, ciudad, email, telefono, id_orders);
    res.status(201).send('Direccion del pedido agregado exitosamente');
  } catch (error) {
    console.error('Error al registrar direccion de pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

const { verifyToken } = require('./middleware/auth');

app.post('/cart/add', verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  try {
    await db.agregarAlCarrito(userId, productId, 1);
    res.status(200).send('Producto agregado al carrito exitosamente');
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener los productos del carrito de un usuario
app.get('/cart', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await db.obtenerCarritoPorUsuario(userId);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/cart/:itemId', verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.userId;

  try {
    await db.eliminarDelCarrito(userId, itemId);
    res.status(200).send('Producto eliminado del carrito exitosamente');
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/cart/:itemId', verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const { quantity } = req.body;
  const userId = req.userId;

  try {
    await db.actualizarCantidadEnCarrito(userId, itemId, quantity);
    res.status(200).send('Cantidad del producto actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.post('/addresses', verifyToken, async (req, res) => {
  const userId = req.userId;
  const direccion = req.body;

  try {
    const direccionGuardada = await db.guardarDireccionUsuario(userId, direccion);
    res.status(200).json(direccionGuardada);
  } catch (error) {
    console.error('Error al guardar la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// app.js
app.get('/get_address', verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const direccion = await db.obtenerDireccionUsuario(userId);
    res.status(200).json(direccion);
  } catch (error) {
    console.error('Error al obtener la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/edit_address', verifyToken, async (req, res) => {
  const userId = req.userId;
  const direccion = req.body;
  try {
    const direccionActualizada = await db.actualizarDireccionUsuario(userId, direccion);
    res.status(200).json(direccionActualizada);
  } catch (error) {
    console.error('Error al actualizar la dirección del usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

const YOUR_DOMAIN = 'https://partyandgift.vercel.app'; // Reemplaza con la URL de tu aplicación

// Endpoint para crear la sesión de Checkout en Stripe
app.post('/create-checkout-session', async (req, res) => {
  const { line_items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de Checkout:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/success', verifyToken, async (req, res) => {
  try {
    // Obtener el ID del usuario del token de autenticación
    const userId = req.userId;

    // 2. Registrar la orden en la tabla "Orders"
    const order = await db.crearOrden(userId);

    


    // Enviar una respuesta JSON
    res.status(200).json({ message: 'Pago exitoso' });
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    res.status(500).send('Error al procesar la orden');
  }
});


// Ruta para obtener el historial de órdenes del usuario
app.get('/orders', verifyToken, async (req, res) => {
  try {
    // Obtener el ID del usuario del token de autenticación
    const userId = req.userId;

    // Obtener el historial de órdenes del usuario
    const orders = await db.obtenerOrdenesUsuario(userId);

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener el historial de órdenes:', error);
    res.status(500).send('Error al obtener el historial de órdenes');
  }
});

app.get('/ordersdetalles', async (req, res) => {
  try {
    const products = await db.obtenerOrdenesVentas();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener el historial de:', error);
    res.status(500).send('Error al obtener el historial de');
  }
});

// Ruta para que el usuario elimine su cuenta
app.delete('/login/:userId', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    await db.eliminarUsuario(userId);
    res.status(200).send('Usuario eliminado de la pagina exitosamente');
  } catch (error) {
    console.error('Error al eliminar el usuario de la pagina:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/user/delete', verifyToken, async (req, res) => {
  const userId = req.userId; // Asumiendo que verifyToken añade el userId al objeto req

  try {
    const deletedRows = await db.deleteUserById(userId);
    if (deletedRows > 0) {
      res.status(200).send('Cuenta de usuario eliminada exitosamente');
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.listen(3001, async () => {
  console.log('Server is running on port 3001');

  // Create default admin user
  await db.createDefaultAdmin();

});*/
