import express from 'express';
import { createTeacher, deleteTeacher, getAllTeachers, getTeacher, getTeacher2, updateTeacher } from '../controllers/teacherController.js';
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
// Rutas del Profesor
router.get('/',    generalLimiter, getAllTeachers);
router.get('/:id', generalLimiter, getTeacher);
router.get('/teacher/:id', generalLimiter, getTeacher2);
router.post('/',      sensitiveRouteLimiter,createTeacher);
router.put('/:id',    sensitiveRouteLimiter,updateTeacher);
router.delete('/:id', sensitiveRouteLimiter,deleteTeacher);

export default router;
