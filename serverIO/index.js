const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Consider restrict origin in production
    methods: ['GET', 'POST']
  }
});

// Definir una ruta en Express
app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al servidorIo de Tutorias.');
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_connected', (userId) => {
    console.log(`User ID ${userId} connected`);
    connectedUsers.set(userId, socket.id);
    io.emit('active_users', Array.from(connectedUsers.keys()));
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key);
      }
    });
    io.emit('active_users', Array.from(connectedUsers.keys()));
  });

  // Optional: Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server is running on port ${port}`);
});
