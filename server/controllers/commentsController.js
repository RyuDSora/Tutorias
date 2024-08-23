import pool from '../database/db.js';

// Crear un nuevo comentario
export const createComment = async (req, res) => {
    const { id } = req.params; // articleId
    const { user_id, content } = req.body;

    try {
        // Crear la tabla si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                article_id INT REFERENCES articles(id),
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insertar el nuevo comentario
        const result = await pool.query(
            'INSERT INTO comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [id, user_id, content]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al crear el comentario.' });
    }
};

// Obtener comentarios por article_id
export const getCommentsByArticleId = async (req, res) => {
    const { id } = req.params; // articleId

    try {
        const result = await pool.query('SELECT * FROM comments WHERE article_id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los comentarios.' });
    }
};