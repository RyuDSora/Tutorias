import express from 'express';
import { getAllTables } from '../controllers/tableController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Configura el limitador de velocidad general (si decides usarlo)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes por ventana de tiempo
  message: 'Too many requests from this IP, please try again after 15 minutes' // mensaje de error personalizado
});


// Ruta para obtener todos los nombres de las tablas
router.get('/get-tables', generalLimiter,getAllTables);



export default router;
