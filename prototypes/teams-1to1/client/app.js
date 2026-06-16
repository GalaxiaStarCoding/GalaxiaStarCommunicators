// Simple mesh signaling-based client for demo purposes
const socket = io();
let localStream;
const peers = {}; // peerId -> RTCPeerConnection

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const joinBtn = document.getElementById('joinBtn');
const hangupBtn = document.getElementById('hangupBtn');
const muteBtn = document.getElementById('muteBtn');
const roomInput = document.getElementById('roomId');
let currentRoom = null;
let muted = false;

async function startLocal() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
}

function createPeerConnection(peerId, isInitiator) {
  if (peers[peerId]) return peers[peerId];
  const pc = new RTCPeerConnection();
  peers[peerId] = pc;

  // add local tracks
  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

  pc.ontrack = (ev) => {
    // single remote stream for 1:1 demo
    remoteVideo.srcObject = ev.streams[0];
  };

  pc.onicecandidate = (ev) => {
    if (ev.candidate) {
      socket.emit('candidate', { to: peerId, from: socket.id, candidate: ev.candidate });
    }
  };

  return pc;
}

joinBtn.onclick = async () => {
  if (!localStream) await startLocal();
  const room = roomInput.value || 'default-room';
  currentRoom = room;
  socket.emit('join', room);
  joinBtn.disabled = true;
  hangupBtn.disabled = false;
  muteBtn.disabled = false;
};

hangupBtn.onclick = () => {
  socket.emit('leave', currentRoom);
  Object.values(peers).forEach(pc => pc.close());
  for (const k in peers) delete peers[k];
  remoteVideo.srcObject = null;
  joinBtn.disabled = false;
  hangupBtn.disabled = true;
  muteBtn.disabled = true;
};

muteBtn.onclick = () => {
  muted = !muted;
  localStream.getAudioTracks().forEach(t => t.enabled = !muted);
  muteBtn.textContent = muted ? 'Unmute' : 'Mute';
};

socket.on('existingPeers', async (list) => {
  // create offers to existing peers
  for (const peerId of list) {
    const pc = createPeerConnection(peerId, true);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { to: peerId, from: socket.id, sdp: offer });
  }
});

socket.on('new-peer', async (peerId) => {
  // someone joined — the new peer will create offers to us via existingPeers flow
  console.log('new peer joined', peerId);
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
  if (peers[peerId]) {
    peers[peerId].close();
    delete peers[peerId];
  }
  remoteVideo.srcObject = null;
});
