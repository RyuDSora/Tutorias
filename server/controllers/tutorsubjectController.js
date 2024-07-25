import pool from '../database/db.js';

// Mostrar todos los registros de tutor_subjects
export const getAllTutorSubjects = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tutor_subjects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tutor_subjects:', error);
    res.status(500).send('Error fetching tutor_subjects.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de tutor_subjects por tutor
export const getTutorSubjects = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tutor_subjects WHERE id_tutor = $1', [id]);
      if (result.rows.length === 0) {
        res.status(404).send('tutor_subjects not found.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error fetching tutor_subjects:', error);
      res.status(500).send('Error fetching tutor_subjects.');
    } finally {
      client.release();
    }
  };

// Crear una nueva tutor_subjects
export const createTutorSubjects = async (req, res) => {
    const { teacher_id, subject_id } = req.body;
    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO tutor_subjects (id_tutor, id_subject)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const result = await client.query(insertQuery, [teacher_id, subject_id]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error inserting tutor_subjects:', error);
      res.status(500).send('Error inserting tutor_subjects.');
    } finally {
      client.release();
    }
  };
  
  // Actualizar un tutor_subjects
export const updateTutorSubjects = async (req, res) => {
    const { id } = req.params;
    const { teacher_id, subject_id} = req.body;
    const client = await pool.connect();
    try {
      const updateQuery = `
        UPDATE tutor_subjects
        SET id_tutor = $1, id_subject = $2
        WHERE id = $3
        RETURNING *;
      `;
      const result = await client.query(updateQuery, [teacher_id, subject_id, id]);
      if (result.rows.length === 0) {
        res.status(404).send('tutor_subjects not found.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error updating tutor_subjects:', error);
      res.status(500).send('Error updating tutor_subjects.');
    } finally {
      client.release();
    }
  };

  // Eliminar un tutor_subjects
export const deleteTutorSubjects = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const deleteQuery = 'DELETE FROM tutor_subjects WHERE id = $1 RETURNING *';
      const result = await client.query(deleteQuery, [id]);
      if (result.rows.length === 0) {
        res.status(404).send('tutor_subjects not found.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error deleting tutor_subjects:', error);
      res.status(500).send('Error deleting tutor_subjects.');
    } finally {
      client.release();
    }
  };
  