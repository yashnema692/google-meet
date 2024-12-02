const WebSocket = require('ws');
const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const websocketRoutes = require('./route/route');
const {
  joinRoom,
  handleSignal,
  handleChat,
  handleLeave,
  handleMicToggle,
  handleCameraToggle,
} = require('./controller/controller');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware for JSON parsing
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/websocketApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/websocket', websocketRoutes);

// WebSocket server logic
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.isAlive = true;

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', async (message) => {
    let data;
    try {
      data = JSON.parse(message); // Parse JSON
    } catch (error) {
      console.error('Invalid JSON:', message);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
      return;
    }

    // Handle messages by type
    switch (data.type) {
      case 'join':
        await joinRoom(ws, data);
        break;
      case 'signal':
        handleSignal(ws, data);
        break;
      case 'chat':
        handleChat(ws, data);
        break;
      case 'toggleMic':
        handleMicToggle(ws, data);
        break;
      case 'toggleCamera':
        handleCameraToggle(ws, data);
        break;
      case 'leave':
        handleLeave(ws, data);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  });

  ws.on('close', () => handleDisconnect(ws));
  ws.on('error', (error) => console.error('WebSocket error:', error));
});

// Handle stale connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`WebSocket server is running on port ${PORT}`));
