const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the prototypes directory so client HTML can be opened at e.g.
// http://localhost:3000/prototypes/teams-1to1/client/index.html
app.use(express.static(path.join(__dirname, '..')));

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    // existing peers excluding self
    const existing = clients.filter(id => id !== socket.id);
    socket.emit('existingPeers', existing);
    // notify others about the new peer
    socket.to(room).emit('new-peer', socket.id);
  });

  socket.on('offer', ({ to, from, sdp }) => {
    io.to(to).emit('offer', { from, sdp });
  });

  socket.on('answer', ({ to, from, sdp }) => {
    io.to(to).emit('answer', { from, sdp });
  });

  socket.on('candidate', ({ to, from, candidate }) => {
    io.to(to).emit('candidate', { from, candidate });
  });

  socket.on('leave', (room) => {
    socket.leave(room);
    socket.to(room).emit('peer-left', socket.id);
  });

  socket.on('disconnecting', () => {
    // inform all rooms we were part of
    for (const room of socket.rooms) {
      if (room === socket.id) continue;
      socket.to(room).emit('peer-left', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Signaling server running on http://localhost:${PORT}`));
