import express from 'express';
import { createSubject, deleteSubject, getAllSubjects, getSubject, updateSubject } from '../controllers/subjectController.js';

const router = express.Router();

// Rutas de Materia
router.get('/', getAllSubjects);
router.get('/:id', getSubject);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
