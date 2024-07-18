// sqlRoute.js

import express from 'express';
import sqlController from '../controllers/sqlController.js';

const router = express.Router();

// Endpoint para ejecutar consultas SQL
router.post('/execute', sqlController.executeQuery);

export default router;
