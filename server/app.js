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
import stripeRoute from './routes/stripeRoute.js'


const app = express();
const port = process.env.PORT || 3000;

// Configura CORS, acepta peticiones get,post... desde tu-torias.vercel.app y desde localhost:5173
app.use(cors({
  origin: ['https://tu-torias.vercel.app', 'http://localhost:5173'],
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
app.use('/stripe',stripeRoute);


// Configuración de servidor HTTP y socket.io --aunq no funciona como deberia XD
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://tu-torias.vercel.app', 'http://localhost:5173'],
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

//servidor principal con NodeJS
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al servidor de Tutorias. ');  
});
