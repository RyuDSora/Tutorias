import pool from '../database/db.js';

// Mostrar todos los registros de pagos
export const getAllPayments = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).send('Error fetching payments.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de pago
export const getPayment = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Payment not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).send('Error fetching payment.');
  } finally {
    client.release();
  }
};

// Crear un nuevo pago
export const createPayment = async (req, res) => {
  const { user_id, amount, payment_date, status } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO payments (user_id, amount, payment_date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [user_id, amount, payment_date, status]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting payment:', error);
    res.status(500).send('Error inserting payment.');
  } finally {
    client.release();
  }
};

// Actualizar un pago existente
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { user_id, amount, payment_date, status } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE payments
      SET user_id = $1, amount = $2, payment_date = $3, status = $4
      WHERE id = $5
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [user_id, amount, payment_date, status, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Payment not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).send('Error updating payment.');
  } finally {
    client.release();
  }
};

// Eliminar un pago
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM payments WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Payment not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).send('Error deleting payment.');
  } finally {
    client.release();
  }
};
