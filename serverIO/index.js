const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedUsers = new Map();

app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al servidor de Tutorias.');
});

wss.on('connection', (ws) => {
  console.log('User connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'user_connected') {
      const { userId } = data;
      console.log(`User ID ${userId} connected`);
      connectedUsers.set(userId, ws);
      broadcastActiveUsers();
    }
  });

  ws.on('close', () => {
    console.log('User disconnected');
    connectedUsers.forEach((value, key) => {
      if (value === ws) {
        connectedUsers.delete(key);
      }
    });
    broadcastActiveUsers();
  });

  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

function broadcastActiveUsers() {
  const activeUsers = Array.from(connectedUsers.keys());
  const message = JSON.stringify({ type: 'active_users', users: activeUsers });
  connectedUsers.forEach((ws) => {
    ws.send(message);
  });
}

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
