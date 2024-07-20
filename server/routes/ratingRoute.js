import express from 'express';
import { createRating, deleteRating, getAllRatings, getRating, updateRating } from '../controllers/ratingController.js';

const router = express.Router();

// Rutas de Calificación
router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);
router.put('/:id', updateRating);
router.delete('/:id', deleteRating);

export default router;
