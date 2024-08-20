import pool from '../database/db.js';

// Mostrar todos los registros de planes
export const getAllplanes = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM planes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching planes:', error);
    res.status(500).send('Error fetching planes.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de planes
export const getPlanes = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM planes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Plan not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching Plan:', error);
    res.status(500).send('Error fetching Plan.');
  } finally {
    client.release();
  }
};

// Crear una nueva planes
export const createPlanes = async (req, res) => {
  const { id, plan, nombre, precio, caracteristicas } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO planes (id, plan, nombre, precio, caracteristicas)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [id, plan, nombre, precio, caracteristicas]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting Plan:', error);
    res.status(500).send('Error inserting Plan.');
  } finally {
    client.release();
  }
};

// Actualizar una planes existente
export const updatePlanes = async (req, res) => {
  const { id } = req.params;
  const { plan, nombre, precio, caracteristicas } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE planes
      SET 
      plan = $1, 
      nombre = $2, 
      precio = $3,
      caracteristicas = $4,
      WHERE id = $5
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [plan, nombre, precio, caracteristicas, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Plan not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating Plan:', error);
    res.status(500).send('Error updating Plan.');
  } finally {
    client.release();
  }
};

// Eliminar una planes
export const deletePlan = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM planes WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Plan not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting Plan:', error);
    res.status(500).send('Error deleting Plan.');
  } finally {
    client.release();
  }
};
