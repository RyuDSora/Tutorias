import express from 'express';
import { createTeacher, deleteTeacher, getAllTeachers, getTeacher, updateTeacher } from '../controllers/teacherController.js';

const router = express.Router();

// Rutas del Profesor
router.get('/', getAllTeachers);
router.get('/:id', getTeacher);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
