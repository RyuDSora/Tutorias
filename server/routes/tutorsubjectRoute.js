import express from 'express';
import { getAllTutorSubjects,
         getTutorSubjects, 
         updateTutorSubjects, 
         deleteTutorSubjects, 
         createTutorSubjects } 
from "../controllers/tutorsubjectController.js"; 
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
router.get('/',       generalLimiter,getAllTutorSubjects);
router.get('/:id',    generalLimiter,getTutorSubjects);
router.post('/',      sensitiveRouteLimiter,createTutorSubjects);
router.put('/:id',    sensitiveRouteLimiter,updateTutorSubjects);
router.delete('/:id', sensitiveRouteLimiter,deleteTutorSubjects);

export default router;