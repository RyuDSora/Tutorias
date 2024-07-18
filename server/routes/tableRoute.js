import express from 'express';
import { createTable, checkTableExists, getAllTables, dropTable, updateTable,getTablesAndColumns } from '../controllers/tableController.js';

const router = express.Router();

// Ruta para crear una tabla con columnas definidas en el cuerpo de la solicitud
router.post('/create-table', createTable);

// Ruta para verificar si una tabla existe
router.get('/check-table/:tableName', checkTableExists);

// Ruta para obtener todos los nombres de las tablas
router.get('/get-tables', getAllTables);

// Ruta para eliminar una tabla
router.delete('/drop-table/:tableName', dropTable);

// Ruta para actualizar una tabla
router.put('/update-table/:tableName', updateTable);

router.get('/get-tables-columns', getTablesAndColumns); 

export default router;
