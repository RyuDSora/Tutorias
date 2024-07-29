import pool from '../database/db.js';
import escapeHtml from 'escape-html';
import { body, validationResult } from 'express-validator';

const validateSqlQuery = [
  body('sqlQuery')
    .isString()
    .trim()
    .withMessage('SQL query must be a valid string.'),
];

const executeQuery = async (req, res) => {
  // Validar la entrada usando express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sqlQuery } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(sqlQuery);
    client.release();

    // Sanitizar la salida antes de enviarla al cliente
    const sanitizedResult = result.rows.map(row => {
      const sanitizedRow = {};
      for (const key in row) {
        if (Object.hasOwnProperty.call(row, key)) {
          sanitizedRow[key] = escapeHtml(row[key].toString());
        }
      }
      return sanitizedRow;
    });

    res.status(200).json(sanitizedResult);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).send('Error executing SQL query');
  }
};

export default {
  executeQuery,
  validateSqlQuery,
};
