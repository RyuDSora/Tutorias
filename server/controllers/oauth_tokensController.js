import pool from '../database/db.js';

// Mostrar todos los registros de oauth_tokens
export const getAlloauth_tokens = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM oauth_tokens');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching oauth_tokens:', error);
    res.status(500).send('Error fetching oauth_tokens.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de oauth_tokens
export const getOauth_tokens = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM oauth_tokens WHERE id_tutor = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('oauth_tokens not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching oauth_tokens:', error);
    res.status(500).send('Error fetching oauth_tokens.');
  } finally {
    client.release();
  }
};

// Crear una nueva oauth_tokens
export const createOauth_tokens = async (req, res) => {
  const { id_tutor,access_token,refresh_token } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO oauth_tokens (id_tutor,access_token,refresh_token)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [id_tutor,access_token,refresh_token]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting oauth_tokens:', error);
    res.status(500).send('Error inserting oauth_tokens.');
  } finally {
    client.release();
  }
};

// Actualizar una oauth_tokens existente
export const updateoauth_tokens = async (req, res) => {
  const { id_tutor } = req.params;
  const { access_token,refresh_token } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE oauth_tokens
      SET access_token = $1, refresh_token = $2
      WHERE id_tutor = $3
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [access_token,refresh_token, id_tutor]);
    if (result.rows.length === 0) {
      res.status(404).send('oauth_tokens not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating oauth_tokens:', error);
    res.status(500).send('Error updating oauth_tokens.');
  } finally {
    client.release();
  }
};

// Eliminar una oauth_tokens
export const deleteoauth_tokens = async (req, res) => {
  const { id_tutor } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM oauth_tokens WHERE id_tutor = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id_tutor]);
    if (result.rows.length === 0) {
      res.status(404).send('oauth_tokens not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting oauth_tokens:', error);
    res.status(500).send('Error deleting oauth_tokens.');
  } finally {
    client.release();
  }
};
