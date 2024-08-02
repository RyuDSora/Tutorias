import express from 'express';
import rateLimit from 'express-rate-limit';
import stripe from 'stripe';
import pool from '../database/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

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

// Controladores
const home = (req, res) => {
  res.status(200).send('Welcome to Stripe Integration.');
};

const stripeTest = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

const addStripe = async (req, res) => {
  const { priceId, userId } = req.body;

  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.SUCCESS_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CANCEL_URL}/cancel`,
    });

    // Guardar la suscripción en la base de datos
    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO subscriptions (user_id, plan_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      await client.query(insertQuery, [userId, priceId]);
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      client.release();
    }

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
};

// Definir rutas
router.get('/', generalLimiter, home);
router.get('/test-stripe-key', generalLimiter, stripeTest);
router.post('/create-checkout-session', sensitiveRouteLimiter, addStripe);

export default router;
