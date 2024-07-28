import express from 'express';
import { saveMessage, getChatHistory } from '../controllers/chatController.js'; // Asegúrate de ajustar la ruta si es necesario
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
// Ruta para guardar un nuevo mensaje
router.post('/messages',sensitiveRouteLimiter, saveMessage);

// Ruta para obtener el historial de mensajes entre dos usuarios
router.get('/messages/:user1/:user2', getChatHistory);

export default router;
