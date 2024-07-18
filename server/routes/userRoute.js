import express from 'express';
import { createUsuario, deleteUsuario, getAllUsuarios, getUsuario, updateUsuario,login,register} from '../controllers/userController.js';

const router = express.Router();

// Rutas del Usuario
router.get('/', getAllUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.post('/login',login);
router.post('/register',register);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);



export default router;
