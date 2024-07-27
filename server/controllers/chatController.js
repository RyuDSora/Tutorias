import pool from '../database/db.js'; // Asegúrate de ajustar la ruta si es necesario

// Guardar un nuevo mensaje en la base de datos
export const saveMessage = async (req, res) => {
  const { emisor, mensaje, receptor } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO chat_history (emisor, mensaje, receptor) VALUES ($1, $2, $3) RETURNING *',
      [emisor, mensaje, receptor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al guardar el mensaje:', err);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
};

// Obtener el historial de mensajes entre dos usuarios
export const getChatHistory = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM chat_history 
       WHERE (emisor = $1 AND receptor = $2) OR (emisor = $2 AND receptor = $1) 
       ORDER BY fecha`,
      [user1, user2]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener el historial de mensajes:', err);
    res.status(500).json({ error: 'Error al obtener el historial de mensajes' });
  }
};
