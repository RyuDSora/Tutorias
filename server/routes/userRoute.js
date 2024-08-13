import express from 'express';
import rateLimit from 'express-rate-limit';
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
  register,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';

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

// Rutas del Usuario
router.get('/',generalLimiter, getAllUsuarios);
router.get('/:id', generalLimiter,getUsuario);
router.post('/', sensitiveRouteLimiter, createUsuario);
router.post('/login', sensitiveRouteLimiter, login);
router.post('/register', sensitiveRouteLimiter, register);
router.put('/:id', sensitiveRouteLimiter, updateUsuario);
router.patch('/:id/password', sensitiveRouteLimiter, updatePassword); // Para actualizar solo la contraseña
router.patch('/:id/email', sensitiveRouteLimiter, updateEmail); // Para actualizar solo el correo electrónico
router.patch('/:id/role', sensitiveRouteLimiter, updateRole); // Para actualizar solo el rol
router.delete('/:id', sensitiveRouteLimiter, deleteUsuario);
router.post('/request-password-reset', sensitiveRouteLimiter, requestPasswordReset); // Nueva ruta para solicitar el restablecimiento de contraseña
router.patch('/reset-password/:token', sensitiveRouteLimiter, resetPassword); //Ruta para actualiza la contraseña

export default router;
