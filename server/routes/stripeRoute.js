import rateLimit from 'express-rate-limit';
import express from 'express';
import { stripeTest, home, addStripe } from "../controllers/stripeContontroller.js";

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


//definir rutas
router.get('/',generalLimiter, home );
router.get('/test-stripe-key', generalLimiter,stripeTest);
router.post('/create-checkout-session',sensitiveRouteLimiter, addStripe);

export default router;
