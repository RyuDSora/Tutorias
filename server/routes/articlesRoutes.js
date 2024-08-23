import express from 'express';
import rateLimit from 'express-rate-limit';

import {
    getAllArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    getArticlesByTeacherId
} from '../controllers/articlesController.js';

const router = express.Router();

// Configura el limitador de velocidad para rutas sensibles
const sensitiveRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // máximo 50 solicitudes por ventana de tiempo
    message: 'Too many requests from this IP, please try again after 15 minutes' // mensaje de error personalizado
});

// Configura el limitador de velocidad general (si decides usarlo)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 solicitudes por ventana de tiempo
    message: 'Too many requests from this IP, please try again after 15 minutes' // mensaje de error personalizado
});

// Rutas de artículos
router.get('/', getAllArticles); // Obtener todos los artículos
router.post('/', createArticle); // Crear un nuevo artículo
router.get('/:id', getArticleById); // Obtener un artículo específico por ID
router.put('/:id', updateArticle); // Actualizar un artículo específico por ID
router.delete('/:id', deleteArticle); // Eliminar un artículo específico por ID

// Nueva ruta para obtener artículos por tutor
router.get('/teacher/:teacher_id', sensitiveRouteLimiter, getArticlesByTeacherId); // Obtener artículos de un tutor específico

export default router;