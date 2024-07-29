import pool from '../database/db.js';
import escapeHtml from 'escape-html';
// Obtener todas las tablas y sus columnas
export const getTablesAndColumns = async (req, res) => {
  const client = await pool.connect();
  try {
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => escapeHtml(row.table_name));

    const tablesAndColumns = {};

    for (const table of tables) {
      const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1;
      `;
      const columnsResult = await client.query(columnsQuery, [table]);
      tablesAndColumns[table] = columnsResult.rows.map(row => escapeHtml(row.column_name));
    }

    res.json(tablesAndColumns);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Error fetching tables and columns.');
  } finally {
    client.release();
  }
};