import pool from '../database/db.js';

// Mostrar todos los registros de profesores
export const getAllTeachers = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teachers');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).send('Error fetching teachers.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de profesor
export const getTeacher = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teachers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Teacher not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).send('Error fetching teacher.');
  } finally {
    client.release();
  }
};

// Crear un nuevo profesor
export const createTeacher = async (req, res) => {
  const { user_id, bio, experience, availability } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO teachers (user_id, bio, experience, availability)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [user_id, bio, experience, availability]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting teacher:', error);
    res.status(500).send('Error inserting teacher.');
  } finally {
    client.release();
  }
};

// Actualizar un profesor existente
export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { user_id, bio, experience, availability } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE teachers
      SET user_id = $1, bio = $2, experience = $3, availability = $4
      WHERE id = $5
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [user_id, bio, experience, availability, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Teacher not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).send('Error updating teacher.');
  } finally {
    client.release();
  }
};

// Eliminar un profesor
export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM teachers WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Teacher not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).send('Error deleting teacher.');
  } finally {
    client.release();
  }
};
