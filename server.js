// Minimal signaling server (Node.js + Socket.io) for mesh prototype
// Run: npm install
// Start: npm start

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static client files from public/
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  // join a room for a group chat
  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);

    socket.on('signal', ({ to, data }) => {
      io.to(to).emit('signal', { from: socket.id, data });
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-left', socket.id);
    });

    socket.on('leave-room', () => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Signaling server listening on', PORT));
