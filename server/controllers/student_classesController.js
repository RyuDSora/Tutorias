import pool from '../database/db.js';

// Mostrar todos los registros de student_classes
export const getAllstudent_classes = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student_classes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching student_classes:', error);
    res.status(500).send('Error fetching student_classes.');
  } finally {
    client.release();
  }
};

// Mostrar un registro de student_classes por estudiante
export const getstudent_classes = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student_classes WHERE student_id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('student_classes not found.');
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching student_classes:', error);
    res.status(500).send('Error fetching student_classes.');
  } finally {
    client.release();
  }
};

// Crear una nueva student_classes
export const createstudent_classes = async (req, res) => {
  const { student_id,class_id } = req.body;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO student_classes (student_id,class_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [student_id,class_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting student_classes:', error);
    res.status(500).send('Error inserting student_classes.');
  } finally {
    client.release();
  }
};

// Actualizar una student_classes existente
export const updatestudent_classes = async (req, res) => {
  const { id } = req.params;
  const { student_id,class_id,active } = req.body;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE student_classes
      SET student_id = $1, class_id = $2, active = $4
      WHERE id = $3
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [student_id,class_id , id,active]);
    if (result.rows.length === 0) {
      res.status(404).send('student_classes not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating student_classes:', error);
    res.status(500).send('Error updating student_classes.');
  } finally {
    client.release();
  }
};

// Eliminar una student_classes
export const deletestudent_classes = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const deleteQuery = 'DELETE FROM student_classes WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      res.status(404).send('student_classes not found.');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting student_classes:', error);
    res.status(500).send('Error deleting student_classes.');
  } finally {
    client.release();
  }
};
