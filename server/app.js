import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import userRoute from './routes/userRoute.js';
import tableRoute from './routes/tableRoute.js';
import sqlRoute from './routes/sqlRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import subjectRoute from './routes/subjectRoute.js';
import classRoute from './routes/classRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import ratingRoute from './routes/ratingRoute.js';
import tutorsubjectRoute from './routes/tutorsubjectRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3000;
//, 'http://localhost:5173'
// Configura CORS
app.use(cors({
  origin: ['https://tu-torias.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/users', userRoute);
app.use('/tables', tableRoute);
app.use('/sql', sqlRoute); 
app.use('/teachers', teacherRoute);
app.use('/subjects', subjectRoute);
app.use('/classes', classRoute);
app.use('/payments', paymentRoute);
app.use('/ratings', ratingRoute);
app.use('/ts', tutorsubjectRoute);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.status(200).json('Bienvenido, tu aplicación se ha ejecutado correctamente');
});

// Ruta para crear suscripciones
const plans = {
  basic: 'price_1PiI5X2KRPeDwuZFwN9hhxto', 
  standard: 'price_1PiI6M2KRPeDwuZFMUoB5DrU',
  advanced: 'price_1PiI732KRPeDwuZFV3XclDU3',
  premium: 'price_1PiI7c2KRPeDwuZFU22BMEdq'
};
app.post('/create-checkout-session', async (req, res) => {
  console.log('Request received at /create-checkout-session'); // Log para verificar la solicitud
  try {
    const { plan } = req.body;
    console.log('Plan:', plan); // Log para verificar el plan recibido
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plans[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://tu-torias.vercel.app/success',
      cancel_url: 'https://tu-torias.vercel.app/cancel',
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(400).send({ error: { message: error.message } });
  }
});
// Configuración de servidor HTTP y socket.io
const server = http.createServer(app);
//, 'http://localhost:5173'
const io = new Server(server, {
  cors: {
    origin: ['https://tu-torias.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  socket.on('user_connected', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('active_users', Array.from(connectedUsers.keys()));
  });

  socket.on('send_message', (msg) => {
    const recipientSocketId = connectedUsers.get(msg.receptor);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', msg);
    }
  });

  socket.on('disconnect', () => {
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key);
      }
    });
    io.emit('active_users', Array.from(connectedUsers.keys()));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/test', (req, res) => {
  res.status(200).send('Server is running');
});
