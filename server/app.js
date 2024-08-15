import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
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
import chatRoutes from './routes/chatRoutes.js';
import stripeRoute from './routes/stripeRoute.js'
import suscriptionRoute from './routes/suscriptionRoute.js'
import { google } from 'googleapis';
import pkg from 'pg'; // Importar el paquete 'pg'

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


const { Pool } = pkg; // Desestructurar para obtener Pool
// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Inicializamos el cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Generar URL de autorización
app.get('/auth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://mail.google.com/'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.redirect(url);
});

// Callback de autorización
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state; // Si decides usarlo para una mejor seguridad
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Guardar tokens en la base de datos
    await saveTokensToDatabase(tokens);

    // Redirigir a una página de éxito o mostrar un mensaje
    res.redirect('http://localhost:5173/users/login'); // Aquí podrías redirigir a una página de éxito.
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send(`Error retrieving access token: ${error.message}`);
  }
});

// Guardar tokens en la base de datos
const saveTokensToDatabase = async (tokens) => {
  const client = await pool.connect();
  try {
    // Crear la tabla oauth_tokens si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS oauth_tokens (
        id SERIAL PRIMARY KEY,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL
      )
    `);

    // Eliminamos los tokens anteriores (si existen)
    await client.query('DELETE FROM oauth_tokens');

    // Insertamos los nuevos tokens
    await client.query(`
      INSERT INTO oauth_tokens (access_token, refresh_token)
      VALUES ($1, $2)`,
      [tokens.access_token, tokens.refresh_token]
    );
  } finally {
    client.release();
  }
};

// Recuperar el último token desde la base de datos
const getTokensFromDatabase = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT access_token, refresh_token FROM oauth_tokens ORDER BY id DESC LIMIT 1');

    if (res.rows.length === 0) {
      return null; // Retorna null si no hay registros
    }

    return res.rows[0]; // Retorna el último token
  } catch (error) {
    console.error('Error al obtener tokens de la base de datos:', error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    client.release();
  }
};

// Endpoint para crear eventos con Google Calendar
app.post('/create-event', async (req, res) => {
  try {
    const tokens = await getTokensFromDatabase();
    if (!tokens) {
      return res.status(400).send('No tokens found in database');
    }

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    const meetClient = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary: req.body.title,
      description: req.body.description,
      start: {
        dateTime: req.body.startTime,
        timeZone: 'America/El_Salvador', // Cambia a tu zona horaria
      },
      end: {
        dateTime: req.body.endTime,
        timeZone: 'America/El_Salvador', // Cambia a tu zona horaria
      },
      conferenceData: {
        createRequest: {
          requestId: 'some-random-string',
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await meetClient.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    res.json({ meetingUrl: response.data.hangoutLink });
  } catch (error) {
    console.error('Error al crear reunión:', error);
    res.status(500).json({ error: 'Error al crear reunión' });
  }
});

// Endpoint para obtener eventos desde Google Calendar
app.get('/events', async (req, res) => {
  try {
    const tokens = await getTokensFromDatabase();
    if (!tokens) {
      return res.status(400).send('No tokens found in database');
    }

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      summary: event.summary,
      location: event.location,
      description: event.description,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      htmlLink: event.htmlLink, // Enlace al evento en Google Calendar
      hangoutLink: event.hangoutLink, // Enlace de Google Meet
    }));

    res.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ error: 'Error retrieving events' });
  }
});

// Endpoint para guardar la información de la sesión en la base de datos
app.post('/save-session', async (req, res) => {
  const { teacherId, subjectId, studentId, title, description, startTime, endTime, googleMeetLink } = req.body;

  if (!teacherId || !subjectId || !title || !description || !startTime || !endTime || !googleMeetLink ) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO classes (teacher_id, subject_id, student_id, title, description, start_time, end_time, google_meet_link, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *;
    `;
    const values = [teacherId, subjectId, studentId, title, description, startTime, endTime, googleMeetLink];

    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar la sesión en la base de datos:', error);
    res.status(500).json({ error: 'Error al guardar la sesión' });
  } finally {
    client.release();
  }
});

// Endpoint para recuperar sesiones desde la base de datos
app.get('/sessions', async (req, res) => {
  const { teacherId, subjectId } = req.query;

  let query = 'SELECT * FROM classes WHERE TRUE';
  const values = [];

  if (teacherId) {
    query += ' AND teacher_id = $1';
    values.push(teacherId);
  }
  if (subjectId) {
    query += ' AND subject_id = $2';
    values.push(subjectId);
  }

  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al recuperar sesiones de la base de datos:', error);
    res.status(500).json({ error: 'Error al recuperar sesiones' });
  } finally {
    client.release();
  }
});

//servidor principal con NodeJS
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al servidor de Tutorias. ');
});
