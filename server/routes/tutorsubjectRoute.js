import express from 'express';
import { getAllTutorSubjects,
         getTutorSubjects, 
         updateTutorSubjects, 
         deleteTutorSubjects, 
         createTutorSubjects } 
from "../controllers/tutorsubjectController.js"; 

const router = express.Router();

// Rutas de Clase
router.get('/', getAllTutorSubjects);
router.get('/:id', getTutorSubjects);
router.post('/', createTutorSubjects);
router.put('/:id', updateTutorSubjects);
router.delete('/:id', deleteTutorSubjects);

export default router;