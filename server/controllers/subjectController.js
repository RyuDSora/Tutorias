import pool from '../database/db.js';

// Mostrar todos los registros de materias
export const getAllSubjects = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM subjects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).send('Error fetching subjects.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de materia
export const getSubject = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM subjects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Subject not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).send('Error fetching subject.');
  } finally {
    client.release();
  }
};

// Crear una nueva materia
export const createSubject = async (req, res) => {
  const { name, description } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO subjects (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [name, description]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting subject:', error);
    res.status(500).send('Error inserting subject.');
  } finally {
    client.release();
  }
};

// Actualizar una materia existente
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE subjects
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [name, description, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Subject not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).send('Error updating subject.');
  } finally {
    client.release();
  }
};

// Eliminar una materia
export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM subjects WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Subject not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).send('Error deleting subject.');
  } finally {
    client.release();
  }
};
