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
import chatRoutes from './routes/chatRoutes.js'; // Importar el router de chat

const app = express();
const port = process.env.PORT || 3000; // Usar variable de entorno para el puerto

// Configura CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
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
app.use('/api', chatRoutes); // Usar las rutas de chat

app.get('/', (req, res) => {
  res.status(200).json('Bienvenido, tu aplicación se ha ejecutado correctamente');
});

// Configuración de servidor HTTP y socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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
  //console.log(`Server is running on port ${port}`);
});



/*

const db = require('./utils/database');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51P0kZtL1xMfPwf6dWCmv8wAoaHc4o01CBOAMWhBz1rm4vk4NDLoJN0Zpf6wGRgRB1LPREQ61OEdA9LoiUkZhf3MR00VJ4sno7M');







const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dqy0f7skk',
  api_key: '626754323673753',
  api_secret: 'eZMydSf0i92LcK3EOdmgwMAEUbU'
});



// Ruta de registro empleado
app.post('/register/empleado', async (req, res) => {
  const { email, password, nombre, apellido, cargo, role } = req.body; // Se obtiene también el campo 'role' del cuerpo de la solicitud

  // Comprueba si el empleado ya existe en la base de datos
  const existingEmpleado = await db.getEmpleadoByEmail(email);
  if (existingEmpleado) {
    return res.status(400).send('El correo electrónico ya está en uso');
  }

  // Crea un nuevo empleado
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.createemployee(email, hashedPassword, nombre, apellido, cargo, role); // Se pasa el campo 'role' a la función createemployee
  return res.send('Empleado registrado exitosamente');
});


// Ruta para el inicio de sesión de empleados
app.post('/login/empleado', async (req, res) => {
  const { email, password } = req.body;
  // Busca el empleado en la base de datos
  const empleado = await db.getEmpleadoByEmail(email);
  if (!empleado) {
    return res.status(401).send('Empleado no encontrado');
  }
  // Comprueba la contraseña
  if (bcrypt.compareSync(password, empleado.password)) {
    let token = jwt.sign({ id: empleado.id, role: empleado.role }, 'secret key');
    return res.json({ message: 'Inicio de sesión de empleado exitoso', token: token });
  } else {
    return res.status(401).send('Correo electrónico o contraseña incorrectos');
  }
});






// // Ruta para cambiar la contraseña del usuario
// app.post('/change-password', authenticateToken, async (req, res) => {
//   const { newPassword } = req.body;
//   const userId = req.user.id; // Obtener el ID del usuario del token

//   // Actualizar la contraseña en la base de datos
//   const hashedPassword = bcrypt.hashSync(newPassword, 10);
//   await db.updateUserPassword(userId, hashedPassword);

//   res.send('Contraseña cambiada exitosamente');
// });




const YOUR_DOMAIN = 'https://partyandgift.vercel.app'; // Reemplaza con la URL de tu aplicación

// Endpoint para crear la sesión de Checkout en Stripe
app.post('/create-checkout-session', async (req, res) => {
  const { line_items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de Checkout:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/success', verifyToken, async (req, res) => {
  try {
    // Obtener el ID del usuario del token de autenticación
    const userId = req.userId;

    // 2. Registrar la orden en la tabla "Orders"
    const order = await db.crearOrden(userId);

    


    // Enviar una respuesta JSON
    res.status(200).json({ message: 'Pago exitoso' });
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    res.status(500).send('Error al procesar la orden');
  }
});




});*/
