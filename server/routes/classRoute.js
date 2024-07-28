import express from 'express';
import { createClass, deleteClass, getAllClasses, getClass, updateClass } from '../controllers/classController.js';
import rateLimit from 'express-rate-limit';

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
  

// Rutas de Clase
router.get('/',generalLimiter, getAllClasses);
router.get('/:id',generalLimiter, getClass);
router.post('/',sensitiveRouteLimiter, createClass);
router.put('/:id',sensitiveRouteLimiter, updateClass);
router.delete('/:id',sensitiveRouteLimiter, deleteClass);

export default router;
