import express from 'express';
import rateLimit from 'express-rate-limit';
import { generarTokens,autenticar,getEvents,getSessions,createEvent,SaveSession } from "../controllers/googleControllers.js";

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

router.get('/auth',generalLimiter,generarTokens );
router.get('/oauth2callback',generalLimiter,autenticar);
router.get('/events',generalLimiter,getEvents);
router.get('/sessions',generalLimiter,getSessions);
router.post('/create-event', sensitiveRouteLimiter,createEvent);
router.post('/save-session', sensitiveRouteLimiter,SaveSession);

export default router;