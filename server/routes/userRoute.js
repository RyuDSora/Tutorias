import express from 'express';
import { 
  createUsuario, 
  deleteUsuario, 
  getAllUsuarios, 
  getUsuario, 
  updateUsuario,
  updatePassword,
  updateEmail,
  updateRole,
  login,
  register 
} from '../controllers/userController.js';

const router = express.Router();

// Rutas del Usuario
router.get('/', getAllUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.post('/login', login);
router.post('/register', register);
router.put('/:id', updateUsuario); 
router.patch('/:id/password', updatePassword); // Para actualizar solo la contraseña
router.patch('/:id/email', updateEmail); // Para actualizar solo el correo electrónico
router.patch('/:id/role', updateRole); // Para actualizar solo el rol
router.delete('/:id', deleteUsuario);

export default router;
