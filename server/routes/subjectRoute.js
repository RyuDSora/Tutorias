import express from 'express';
import { createSubject, deleteSubject, getAllSubjects, getSubject, updateSubject } from '../controllers/subjectController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
// Configura el limitador de velocidad para rutas sensibles
const sensitiveRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // máximo 50 solicitudes por ventana de tiempo
    message: 'Too many requests from this IP, please try again after 15 minutes' // mensaje de error personalizado
  });
  
  // Configura el limitador de velocidad general (si decides usarlo)
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000, // máximo 100 solicitudes por ventana de tiempo
    message: 'Too many requests from this IP, please try again after 15 minutes' // mensaje de error personalizado
  });
// Rutas de Materia
router.get('/',    generalLimiter,getAllSubjects);
router.get('/:id', generalLimiter,getSubject);
router.post('/',     sensitiveRouteLimiter,createSubject);
router.put('/:id',   sensitiveRouteLimiter,  updateSubject);
router.delete('/:id',sensitiveRouteLimiter, deleteSubject);

export default router;
