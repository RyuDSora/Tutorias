import express from 'express';
import { saveMessage, getChatHistory } from '../controllers/chatController.js'; // Asegúrate de ajustar la ruta si es necesario

const router = express.Router();

// Ruta para guardar un nuevo mensaje
router.post('/messages', saveMessage);

// Ruta para obtener el historial de mensajes entre dos usuarios
router.get('/messages/:user1/:user2', getChatHistory);

export default router;
