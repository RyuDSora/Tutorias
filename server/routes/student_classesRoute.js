import express from 'express';
import { createstudent_classes, deletestudent_classes, getAllstudent_classes, getstudent_classes, updatestudent_classes } from '../controllers/student_classesController.js';
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
router.get('/',    generalLimiter, getAllstudent_classes);
router.get('/:id', generalLimiter, getstudent_classes);
router.post('/',      sensitiveRouteLimiter,createstudent_classes);
router.put('/:id',    sensitiveRouteLimiter,updatestudent_classes);
router.delete('/:id', sensitiveRouteLimiter,deletestudent_classes);

export default router;
