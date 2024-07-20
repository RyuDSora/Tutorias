import express from 'express';
import { createClass, deleteClass, getAllClasses, getClass, updateClass } from '../controllers/classController.js';

const router = express.Router();

// Rutas de Clase
router.get('/', getAllClasses);
router.get('/:id', getClass);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;
