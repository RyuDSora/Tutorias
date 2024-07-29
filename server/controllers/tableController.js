import pool from '../database/db.js';
import escapeHtml from 'escape-html';

// Obtener todos los nombres de las tablas con sus columnas y llaves primarias
export const getAllTables = async (req, res) => {
  const client = await pool.connect();
  try {
    const getTablesQuery = `
      SELECT 
        c.table_name, 
        c.column_name, 
        c.data_type, 
        c.is_nullable, 
        tc.constraint_type
      FROM 
        information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_name = kcu.table_name 
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name 
          AND tc.constraint_type = 'PRIMARY KEY'
      WHERE 
        c.table_schema = 'public'
      ORDER BY 
        c.table_name, c.ordinal_position;
    `;
    const result = await client.query(getTablesQuery);
    const tables = {};

    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = { columns: [] };
      }
      tables[row.table_name].columns.push({
        column_name: escapeHtml(row.column_name),
        data_type: escapeHtml(row.data_type),
        is_nullable: escapeHtml(row.is_nullable),
        is_primary_key: row.constraint_type === 'PRIMARY KEY'
      });
    });

    res.json(tables);
  } catch (error) {
    console.error('Error fetching table names and columns:', error);
    res.status(500).send('Error fetching table names and columns.');
  } finally {
    client.release();
  }
};
