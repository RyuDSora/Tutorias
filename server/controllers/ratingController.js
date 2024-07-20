import pool from '../database/db.js';

// Mostrar todos los registros de calificaciones
export const getAllRatings = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM ratings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).send('Error fetching ratings.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de calificación
export const getRating = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM ratings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Rating not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching rating:', error);
    res.status(500).send('Error fetching rating.');
  } finally {
    client.release();
  }
};

// Crear una nueva calificación
export const createRating = async (req, res) => {
  const { class_id, rating, comment } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO ratings (class_id, rating, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [class_id, rating, comment]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting rating:', error);
    res.status(500).send('Error inserting rating.');
  } finally {
    client.release();
  }
};

// Actualizar una calificación existente
export const updateRating = async (req, res) => {
  const { id } = req.params;
  const { class_id, rating, comment } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE ratings
      SET class_id = $1, rating = $2, comment = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [class_id, rating, comment, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Rating not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).send('Error updating rating.');
  } finally {
    client.release();
  }
};

// Eliminar una calificación
export const deleteRating = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM ratings WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Rating not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).send('Error deleting rating.');
  } finally {
    client.release();
  }
};
