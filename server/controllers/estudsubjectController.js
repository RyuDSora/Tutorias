import pool from '../database/db.js';

// Mostrar todos los registros de estudi_subjects
export const getAllEstudiSubjects = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM estudi_subjects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching estudi_subjects:', error);
    res.status(500).send('Error fetching estudi_subjects.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de estudi_subjects por estudi
export const getEstudiSubjects = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM estudi_subjects WHERE id_estudi = $1', [id]);
      if (result.rows.length === 0) {
        res.status(404).send('estudi_subjects not found.');
      } else {
        res.json(result.rows);
      }
    } catch (error) {
      console.error('Error fetching estudi_subjects:', error);
      res.status(500).send('Error fetching estudi_subjects.');
    } finally {
      client.release();
    }
  };

// Crear una nueva estudi_subjects
export const createEstudiSubjects = async (req, res) => {
    const { estudi_id, subject_id } = req.body;
    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO estudi_subjects (id_estudi, id_subject)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const result = await client.query(insertQuery, [estudi_id, subject_id]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error inserting estudi_subjects:', error);
      res.status(500).send('Error inserting estudi_subjects.');
    } finally {
      client.release();
    }
  };
  
  // Actualizar un estudi_subjects
export const updateEstudiSubjects = async (req, res) => {
    const { id } = req.params;
    const { estudi_id, subject_id} = req.body;
    const client = await pool.connect();
    try {
      const updateQuery = `
        UPDATE estudi_subjects
        SET id_estudi = $1, id_subject = $2
        WHERE id = $3
        RETURNING *;
      `;
      const result = await client.query(updateQuery, [estudi_id, subject_id, id]);
      if (result.rows.length === 0) {
        res.status(404).send('estudi_subjects not found.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error updating estudi_subjects:', error);
      res.status(500).send('Error updating estudi_subjects.');
    } finally {
      client.release();
    }
  };

  // Eliminar un estudi_subjects
export const deleteEstudiSubjects = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const deleteQuery = 'DELETE FROM estudi_subjects WHERE id = $1 RETURNING *';
      const result = await client.query(deleteQuery, [id]);
      if (result.rows.length === 0) {
        res.status(404).send('estudi_subjects not found.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error deleting estudi_subjects:', error);
      res.status(500).send('Error deleting estudi_subjects.');
    } finally {
      client.release();
    }
  };
  