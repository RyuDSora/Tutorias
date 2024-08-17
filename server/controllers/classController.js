import pool from '../database/db.js';

// Mostrar todos los registros de clases por tutor
export const getAllClasses = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).send('Error fetching classes.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de clase
export const getClass = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM classes WHERE teacher_id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Class not found.');
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).send('Error fetching class.');
  } finally {
    client.release();
  }
};

// Crear una nueva clase
export const createClass = async (req, res) => {
  const { teacher_id, subject_id, student_id, start_time, end_time, google_meet_link } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO classes (teacher_id, subject_id, student_id, start_time, end_time, google_meet_link)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [teacher_id, subject_id, student_id, start_time, end_time, google_meet_link]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting class:', error);
    res.status(500).send('Error inserting class.');
  } finally {
    client.release();
  }
};

// Actualizar una clase existente
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { teacher_id, subject_id, student_id, start_time, end_time, google_meet_link } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE classes
      SET teacher_id = $1, subject_id = $2, student_id = $3, start_time = $4, end_time = $5, google_meet_link = $6
      WHERE id = $7
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [teacher_id, subject_id, student_id, start_time, end_time, google_meet_link, id]);
    if (result.rows.length === 0) {
      res.status(404).send('Class not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).send('Error updating class.');
  } finally {
    client.release();
  }
};

// Eliminar una clase
export const deleteClass = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM classes WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Class not found.');
    } else {
      const resultado = {
        message: 'Event deleted successfully',
        data: result.rows[0]
      };
      res.status(200).json(resultado);
    }
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).send('Error deleting class.');
  } finally {
    client.release();
  }
};
