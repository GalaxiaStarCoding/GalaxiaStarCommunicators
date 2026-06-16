// Group mesh demo reusing the signaling server
const socket = io();
let localStream;
const peers = {}; // peerId -> RTCPeerConnection

const grid = document.getElementById('grid');
const joinBtn = document.getElementById('joinBtn');
const hangupBtn = document.getElementById('hangupBtn');
const roomInput = document.getElementById('roomId');
let currentRoom = null;

async function startLocal() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

function makeTile(peerId) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.id = `tile_${peerId}`;
  const vid = document.createElement('video');
  vid.autoplay = true; vid.playsInline = true;
  tile.appendChild(vid);
  grid.appendChild(tile);
  return vid;
}

function removeTile(peerId) {
  const el = document.getElementById(`tile_${peerId}`);
  if (el) el.remove();
}

function createPeerConnection(peerId, isInitiator) {
  if (peers[peerId]) return peers[peerId];
  const pc = new RTCPeerConnection();
  peers[peerId] = pc;

  // add local tracks
  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

  const vid = makeTile(peerId);
  pc.ontrack = (ev) => { vid.srcObject = ev.streams[0]; };
  pc.onicecandidate = (ev) => {
    if (ev.candidate) socket.emit('candidate', { to: peerId, from: socket.id, candidate: ev.candidate });
  };
  return pc;
}

joinBtn.onclick = async () => {
  if (!localStream) await startLocal();
  const room = roomInput.value || 'group-room';
  currentRoom = room;
  socket.emit('join', room);
  joinBtn.disabled = true;
  hangupBtn.disabled = false;
};

hangupBtn.onclick = () => {
  socket.emit('leave', currentRoom);
  Object.values(peers).forEach(pc => pc.close());
  for (const k in peers) delete peers[k];
  grid.innerHTML = '';
  joinBtn.disabled = false;
  hangupBtn.disabled = true;
};

socket.on('existingPeers', async (list) => {
  for (const peerId of list) {
    const pc = createPeerConnection(peerId, true);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { to: peerId, from: socket.id, sdp: offer });
  }
});

socket.on('offer', async ({ from, sdp }) => {
  const pc = createPeerConnection(from, false);
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit('answer', { to: from, from: socket.id, sdp: answer });
});

socket.on('answer', async ({ from, sdp }) => {
  const pc = peers[from];
  if (!pc) return;
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
});

socket.on('candidate', async ({ from, candidate }) => {
  const pc = peers[from];
  if (!pc) return;
  try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn(e); }
});

socket.on('peer-left', (peerId) => {
  if (peers[peerId]) { peers[peerId].close(); delete peers[peerId]; }
  removeTile(peerId);
});
