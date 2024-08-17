import pool from '../database/db.js';

import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';


// Configuración de la base de datos

// Inicializamos el cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

//generar tokens
export const generarTokens = async(req,res) =>{
    const {id} =req.params
    res.cookie('userId', id, { httpOnly: true });
    
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://mail.google.com/'
      ];
    
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
      });
      
      res.redirect(url);
}

//autizacion
export const autenticar = async(req,res) => {
    const code = req.query.code;
    const state = req.query.state; // Si decides usarlo para una mejor seguridad
    const userId = req.cookies.userId;
    
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Guardar tokens en la base de datos
    await saveTokensToDatabase(tokens,userId);

    // Redirigir a una página de éxito o mostrar un mensaje
    res.redirect(process.env.URL_FRONT_ORIGIN || 'http://localhost:5173/dashboardtutor/my-courses'); // Aquí podrías redirigir a una página de éxito.
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send(`Error retrieving access token: ${error.message}`);
  }
}

//crear eventos con Google Calendar
export const createEvent = async(req,res) =>{
  const {id} = req.params;

    try {
        const tokens = await getTokensFromDatabase(id);
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
            dateTime: req.body.start_time,
            timeZone: 'America/El_Salvador', // Cambia a tu zona horaria
          },
          end: {
            dateTime: req.body.end_time,
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
          visibility: 'public', // Asegura que el evento sea público
          guestsCanSeeOtherGuests: true, // Permite que los invitados se vean entre sí
        };
    
        const response = await meetClient.events.insert({
          calendarId: 'primary',
          resource: event,
          conferenceDataVersion: 1,
          sendUpdates:'all',
        });
        
        res.json({ meetingUrl: response.data.hangoutLink, meetId:response.data.id });
      } catch (error) {
        console.error('Error al crear reunión:', error);
        res.status(500).json({ error: 'Error al crear reunión' });
      }
}

//obtener eventos desde Google Calendar
export const getEvents = async(req,res) => {
    const {id} = req.params;
    try {
        const tokens = await getTokensFromDatabase(id);
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
          orderBy: 'start_time',
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
}
  // Borrar evento desde Google Calendar
  export const deleteEvent = async (req, res) => {
    const { id } = req.params; // ID del tutor
    const { eventId } = req.body; // ID del evento a eliminar
    try {
      const tokens = await getTokensFromDatabase(id);
      if (!tokens) {
        return res.status(400).send('No tokens found in database');
      }
  
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
  
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
  
      res.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
  };
  

//guardar la información de la sesión en la base de datos
export const SaveSession = async(req,res) => {
    const { teacher_id, subject_id, title, description, start_time, end_time, googleMeetLink, meetid } = req.body;

    if (!teacher_id || !subject_id || !title || !description || !start_time || !end_time || !googleMeetLink || !meetid) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO classes (teacher_id, subject_id, title, description, start_time, end_time, google_meet_link, meetid, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *;
      `;
      const values = [teacher_id, subject_id, title, description, start_time, end_time, googleMeetLink,meetid];

      const result = await client.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al guardar la sesión en la base de datos:', error);
      res.status(500).json({ error: 'Error al guardar la sesión' });
    } finally {
      client.release();
    }
}


//recuperar sesiones desde la base de datos
export const getSessions = async(req,res) => {
    const { teacher_id, subject_id } = req.query;

  let query = 'SELECT * FROM classes WHERE TRUE';
  const values = [];

  if (teacher_id) {
    query += ' AND teacher_id = $1';
    values.push(teacher_id);
  }
  if (subject_id) {
    query += ' AND subject_id = $2';
    values.push(subject_id);
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
}


// Guardar tokens en la base de datos
const saveTokensToDatabase = async (tokens,idtutor) => {
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
      await client.query('DELETE FROM oauth_tokens where id_tutor=$1',[idtutor]);
  
      // Insertamos los nuevos tokens
      await client.query(`
        INSERT INTO oauth_tokens (access_token, refresh_token,id_tutor)
        VALUES ($1, $2, $3)`,
        [tokens.access_token, tokens.refresh_token, idtutor]
      );
    } finally {
      client.release();
    }
  };
  
  // Recuperar el último token desde la base de datos
  const getTokensFromDatabase = async (id) => {
    const client = await pool.connect();
    try {
      const res = 
      await client.query('SELECT access_token, refresh_token FROM oauth_tokens where id_tutor=$1 ORDER BY id DESC LIMIT 1',[id]);
  
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

