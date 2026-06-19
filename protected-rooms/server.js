const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const SECRET = process.env.ROOM_SECRET || 'change_this_secret';
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'rooms.json');

function loadDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE)); }
  catch { return { rooms: [] }; }
}
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = loadDB();

// Create a room (protected)
app.post('/rooms/create', async (req, res) => {
  const { name, password } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const id = nanoid(8);
  const room = { id, name, protected: !!password };
  if (password) {
    const hash = await bcrypt.hash(password, 12);
    room.passwordHash = hash;
  }
  db.rooms.push(room);
  saveDB(db);
  res.json({ id, name, protected: room.protected });
});

// Join a room (verify password -> return token)
app.post('/rooms/join', async (req, res) => {
  const { roomId, password } = req.body;
  const room = db.rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ error: 'room not found' });

  if (room.protected) {
    if (!password) return res.status(401).json({ error: 'password required' });
    const ok = await bcrypt.compare(password, room.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid password' });
  }

  // issue short-lived token
  const token = jwt.sign({ roomId }, SECRET, { expiresIn: '2h' });
  res.json({ token, roomId, name: room.name });
});

// Socket.IO auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('auth token required'));
  try {
    const payload = jwt.verify(token, SECRET);
    socket.roomId = payload.roomId;
    return next();
  } catch (err) {
    return next(new Error('invalid token'));
  }
});

io.on('connection', (socket) => {
  const roomId = socket.roomId;
  socket.join(roomId);

  // example messages
  socket.on('message', (msg) => {
    // broadcast to room
    io.to(roomId).emit('message', { from: socket.id, text: msg });
  });

  socket.on('disconnect', () => {
    // handle disconnect if needed
  });
});

server.listen(PORT, () => console.log(`listening on ${PORT}`));
