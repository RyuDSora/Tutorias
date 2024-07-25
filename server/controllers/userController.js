import pool from '../database/db.js';
import bcrypt from 'bcrypt'; // Importar bcrypt con la sintaxis ES6

// Mostrar todos los registros que posiblemente pueda ver el admin
export const getAllUsuarios = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users.');
  } finally {
    client.release();
  }
};

// Mostrar un registro, este lo usaremos para que vea su perfil
export const getUsuario = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('User not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user.');
  } finally {
    client.release();
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  // Conectar al cliente de la base de datos
  const client = await pool.connect();
  try {
    // Buscar el usuario por email
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      // El usuario no existe
      res.status(404).send('Usuario no existe.');
      return;
    }
    
    const user = result.rows[0];
    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password); // Asumiendo que la contraseña está hasheada

    if (!isPasswordValid) {
      res.status(401).send('Contraseña incorrecta.');
      return;
    }
    /*
    if (user.password !== password) {
      res.status(401).send('Contraseña incorrecta.');
      return;
    }*/
    // Enviar respuesta si la autenticación es exitosa
    res.json({ message: 'Autenticación exitosa.', user });

  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).send('Error al buscar el usuario.');
  } finally {
    client.release();
  }

}

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const { name, email } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data.');
  } finally {
    client.release();
  }
};


export const register = async (req, res) => {
  const { email, password, name, surname, birthDate, role } = req.body;
  // Conectar al cliente de la base de datos
  const client = await pool.connect();
  try {
    // Buscar el usuario por email
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      // El usuario no existe
      const hashedPassword = bcrypt.hashSync(password, 10);
      const insertQuery = `
        INSERT INTO users (email, password, name, last, birth, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const insertResult = await client.query(insertQuery, [email, hashedPassword, name, surname, birthDate, role]);
      res.status(201).json(insertResult.rows[0]);
    } else {
      // El correo electrónico ya está en uso
      res.status(400).send('El correo electrónico ya está en uso');
    }
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario.');
  } finally {
    client.release();
  }
};
//actualizar el password
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const client = await pool.connect();
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING *;
    `;
    
    const result = await client.query(updateQuery, [hashedPassword, id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Error updating password.');
  } finally {
    client.release();
  }
};
//actualizar el email
export const updateEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE users
      SET email = $1
      WHERE id = $2
      RETURNING *;
    `;
    
    const result = await client.query(updateQuery, [email, id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).send('Error updating email.');
  } finally {
    client.release();
  }
};
//actualizar el role
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING *;
    `;
    
    const result = await client.query(updateQuery, [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).send('Error updating role.');
  } finally {
    client.release();
  }
};
//actualizar el usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, last, birth, gender } = req.body;

  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE users
      SET 
        name = $1,
        last = $2,
        birth = $3,
        gender = $4
      WHERE id = $5
      RETURNING *;
    `;
    
    const result = await client.query(updateQuery, [name, last, birth, gender, id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).send('Error updating user details.');
  } finally {
    client.release();
  }
};


// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('User not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user.');
  } finally {
    client.release();
  }
};
