import express from 'express';
import { getAllEstudiSubjects,
         getEstudiSubjects, 
         updateEstudiSubjects, 
         deleteEstudiSubjects, 
         createEstudiSubjects } 
from "../controllers/estudsubjectController.js"; 
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
// Rutas de Clase
router.get('/',       generalLimiter,getAllEstudiSubjects);
router.get('/:id',    generalLimiter,getEstudiSubjects);
router.post('/',      sensitiveRouteLimiter,createEstudiSubjects);
router.put('/:id',    sensitiveRouteLimiter,updateEstudiSubjects);
router.delete('/:id', sensitiveRouteLimiter,deleteEstudiSubjects);

export default router;