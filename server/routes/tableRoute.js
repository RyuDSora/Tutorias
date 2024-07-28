import express from 'express';
import { createTable, checkTableExists, getAllTables, dropTable, updateTable,getTablesAndColumns } from '../controllers/tableController.js';
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

// Ruta para crear una tabla con columnas definidas en el cuerpo de la solicitud
router.post('/create-table', sensitiveRouteLimiter,createTable);

// Ruta para verificar si una tabla existe
router.get('/check-table/:tableName', generalLimiter, checkTableExists);

// Ruta para obtener todos los nombres de las tablas
router.get('/get-tables', generalLimiter,getAllTables);

// Ruta para eliminar una tabla
router.delete('/drop-table/:tableName',sensitiveRouteLimiter, dropTable);

// Ruta para actualizar una tabla
router.put('/update-table/:tableName',sensitiveRouteLimiter, updateTable);

router.get('/get-tables-columns',generalLimiter, getTablesAndColumns); 

export default router;
