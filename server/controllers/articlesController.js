import pool from '../database/db.js';

// Función auxiliar para verificar si la tabla existe
const checkIfTableExists = async (tableName) => {
    const result = await pool.query(`
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = $1
        )
    `, [tableName]);
    return result.rows[0].exists;
};

// Obtener todos los artículos
export const getAllArticles = async (req, res) => {
    try {
        const articlesExists = await checkIfTableExists('articles');

        if (!articlesExists) {
            return res.status(404).json({ message: 'La tabla de artículos no existe.' });
        }

        const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');

        // Comprobación que result.rows es un array
        if (!Array.isArray(result.rows)) {
            return res.status(500).json({ error: 'Formato de respuesta incorrecto.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los artículos.', details: error.message });
    }
};

// Crear un nuevo artículo
export const createArticle = async (req, res) => {
    const { title, content, teacher_id, subject_id } = req.body;

    try {
        // Crear la tabla si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                teacher_id INT REFERENCES teachers(id),
                subject_id INT REFERENCES subjects(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insertar nuevo artículo
        const result = await pool.query(
            'INSERT INTO articles (title, content, teacher_id, subject_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, teacher_id, subject_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al crear el artículo.' });
    }
};

// Obtener un artículo específico y sus comentarios
export const getArticleById = async (req, res) => {
    const { id } = req.params;

    try {
        const articlesExists = await checkIfTableExists('articles');
        const commentsExists = await checkIfTableExists('comments');

        if (!articlesExists) {
            return res.status(404).json({ message: 'La tabla de artículos no existe.' });
        }

        if (!commentsExists) {
            // Si no hay comentarios, devolvemos que no existen, pero aún así retornamos el artículo.
            const articleResult = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);

            if (articleResult.rows.length === 0) {
                return res.status(404).json({ message: 'Artículo no encontrado' });
            }

            return res.json({ article: articleResult.rows[0], comments: [] });
        }

        // Si ambas tablas existen, procedemos a buscar
        const articleResult = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
        const commentsResult = await pool.query('SELECT * FROM comments WHERE article_id = $1', [id]);

        if (articleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.json({ article: articleResult.rows[0], comments: commentsResult.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener el artículo.' });
    }
};

// Obtener artículos por tutor
export const getArticlesByTeacherId = async (req, res) => {
    const { teacher_id } = req.params;

    try {
        const articlesExists = await checkIfTableExists('articles');

        if (!articlesExists) {
            return res.status(404).json({ message: 'La tabla de artículos no existe.' });
        }

        const result = await pool.query(`
            SELECT a.*, COUNT(c.id) AS comment_count
            FROM articles a
            LEFT JOIN comments c ON a.id = c.article_id
            WHERE a.teacher_id = $1
            GROUP BY a.id
            ORDER BY a.created_at DESC
        `, [teacher_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron artículos para este tutor.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los artículos del tutor.', details: error.message });
    }
};

// Actualizar un artículo
export const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const articlesExists = await checkIfTableExists('articles');

        if (!articlesExists) {
            return res.status(404).json({ message: 'La tabla de artículos no existe.' });
        }

        const result = await pool.query(
            'UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el artículo.' });
    }
};

// Eliminar un artículo
export const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const articlesExists = await checkIfTableExists('articles');

        if (!articlesExists) {
            return res.status(404).json({ message: 'La tabla de artículos no existe.' });
        }

        const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al eliminar el artículo.' });
    }
};