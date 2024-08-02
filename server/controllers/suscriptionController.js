import pool from '../database/db.js';

// Mostrar todos los registros de suscripciones
export const getAllSuscrptions = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM subscriptions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Error fetching subscriptions.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de suscripcion
export const getSubscriptions = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM subscriptions WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('subscriptions not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send('Error fetching subscriptions.');
  } finally {
    client.release();
  }
};

// Crear una nueva suscripcion
export const createSubscriptions = async (req, res) => {
  const { user_id, plan_id, subscription_date, status } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO subscriptions (user_id, plan_id, subscription_date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [user_id, plan_id, subscription_date, status]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting subscriptions:', error);
    res.status(500).send('Error inserting subscriptions.');
  } finally {
    client.release();
  }
};

// Actualizar una suscripcion existente
export const updateSubscriptions = async (req, res) => {
  const { id } = req.params;
  const { user_id, plan_id, subscription_date, status } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE subscriptions
      SET user_id = $1, plan_id = $2, subscription_date = $3, status = $4
      WHERE id = $5
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [user_id, plan_id, subscription_date, status, id]);
    if (result.rows.length === 0) {
      res.status(404).send('subscriptions not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    res.status(500).send('Error updating subscriptions.');
  } finally {
    client.release();
  }
};

// Eliminar una suscripcion
export const deletesubscriptions = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM subscriptions WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('subscriptions not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting subscriptions:', error);
    res.status(500).send('Error deleting subscriptions.');
  } finally {
    client.release();
  }
};
