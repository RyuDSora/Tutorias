import pool from '../database/db.js';

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

// Actualizar un usuario existente
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [name, email, id]);
    if (result.rows.length === 0) {
      res.status(404).send('User not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user.');
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
