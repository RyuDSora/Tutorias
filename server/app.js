import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import tableRoute from './routes/tableRoute.js';
import sqlRoute from './routes/sqlRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import subjectRoute from './routes/subjectRoute.js';
import classRoute from './routes/classRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import ratingRoute from './routes/ratingRoute.js';
import tutorsubjectRoute from './routes/tutorsubjectRoute.js';
import estudisubjectRoute from './routes/estudisubjectRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import stripeRoute from './routes/stripeRoute.js'
import suscriptionRoute from './routes/suscriptionRoute.js'
import googleRoute from './routes/googleRoute.js'
import oauth_tokensRoute from './routes/oauth_tokensRoute.js'
import planesRoute from './routes/planesRoute.js'
import studiClases from './routes/student_classesRoute.js'

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
app.use(express.json()); // Para poder procesar JSON en el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

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
app.use('/stripe', stripeRoute);
app.use('/suscription', suscriptionRoute);
app.use('/apigoogle', googleRoute);
app.use('/oauth', oauth_tokensRoute);
app.use('/planes',planesRoute);
app.use('/estudisub',estudisubjectRoute);
app.use('/estclases',studiClases)

//servidor principal con NodeJS
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al servidor de Tutorias. ');
});
