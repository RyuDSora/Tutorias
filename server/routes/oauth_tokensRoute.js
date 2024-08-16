import express from 'express';
import { createOauth_tokens, deleteoauth_tokens, getAlloauth_tokens, getOauth_tokens, updateoauth_tokens } from '../controllers/oauth_tokensController.js';
import rateLimit from 'express-rate-limit';

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
  

// Rutas 
router.get('/',generalLimiter, getAlloauth_tokens);
router.get('/:id',generalLimiter, getOauth_tokens);
router.post('/',sensitiveRouteLimiter, createOauth_tokens);
router.put('/:id',sensitiveRouteLimiter, updateoauth_tokens);
router.delete('/:id',sensitiveRouteLimiter, deleteoauth_tokens);

export default router;
