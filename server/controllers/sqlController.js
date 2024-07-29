// sqlController.js

import pool from '../database/db.js';

const executeQuery = async (req, res) => {
  const { sqlQuery } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(sqlQuery);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).send('Error executing SQL query');
  }
};

export default {
  executeQuery,
};
