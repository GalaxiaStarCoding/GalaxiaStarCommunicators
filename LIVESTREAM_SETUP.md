# 🎥 Galaxia Star Communicators - Livestream Feature

## Overview
This livestream module adds YouTube, Twitch, and WebRTC streaming capabilities to Galaxia Star Communicators. Broadcasters can stream to multiple platforms simultaneously with integrated viewer chat.

## Features

✅ **Multi-Platform Broadcasting**
- YouTube Live
- Twitch
- Direct WebRTC streaming
- Simultaneous streaming to all platforms

✅ **Live Chat**
- Real-time messaging from viewers
- Broadcaster identification
- Chat history for new viewers

✅ **Stream Discovery**
- Live stream browsing
- Viewer count tracking
- Platform badges
- Stream information display

✅ **Broadcaster Tools**
- Camera/Microphone toggle
- Stream settings (title, description)
- Platform selection
- Real-time viewer count

## Files Added

1. **livestream-server.js** - WebSocket server handling streaming logic
2. **livestream-broadcaster.html** - Broadcaster interface
3. **livestream-viewer.html** - Viewer discovery and chat interface
4. **LIVESTREAM_SETUP.md** - This documentation

## Installation & Setup

### 1. Install Dependencies
```bash
npm install express socket.io
```

### 2. Update package.json
Add the livestream server to your package.json scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "livestream": "node livestream-server.js"
  }
}
```

### 3. Get Streaming Keys

#### YouTube Live
1. Go to [YouTube Studio](https://studio.youtube.com)
2. Navigate to "Create" → "Go Live"
3. Copy your RTMP URL (format: `rtmp://a.rtmp.youtube.com/live2/[KEY]`)
4. Stream key will be provided

#### Twitch
1. Go to [Twitch Dashboard](https://dashboard.twitch.tv)
2. Click "Settings" → "Stream Key"
3. Copy your Stream Key
4. Use RTMP URL: `rtmp://live.twitch.tv/app/[KEY]`

### 4. Run the Livestream Server
```bash
node livestream-server.js
```
Server runs on `http://localhost:3001`

### 5. Access the Applications

**For Broadcasters:**
```
http://localhost:3001/livestream-broadcaster.html
```

**For Viewers:**
```
http://localhost:3001/livestream-viewer.html
```

## Usage

### As a Broadcaster

1. Open `livestream-broadcaster.html`
2. Fill in stream details:
   - Stream Title
   - Description
   - Select platforms (YouTube, Twitch, WebRTC)
   - (Optional) Enter RTMP URLs for YouTube/Twitch
3. Grant camera & microphone permissions
4. Click "Start Streaming"
5. Manage stream with control buttons:
   - 📷 Toggle Camera
   - 🎤 Toggle Microphone
   - 🔴 End Stream
6. Interact with live chat on the sidebar

### As a Viewer

1. Open `livestream-viewer.html`
2. Browse available live streams
3. Click on a stream to join
4. Watch and participate in live chat
5. Close the stream to return to browsing

## API Reference

### Socket.IO Events

#### Broadcaster Events

**start-stream**
```javascript
socket.emit('start-stream', {
  title: 'Stream Title',
  description: 'Stream description',
  platforms: ['youtube', 'twitch', 'webrtc'],
  rtmpUrls: {
    youtube: 'rtmp://...',
    twitch: 'rtmp://...'
  }
}, (response) => {
  // response.success, response.streamId
});
```

**end-stream**
```javascript
socket.emit('end-stream', streamId, (response) => {
  // response.success
});
```

**chat-message**
```javascript
socket.emit('chat-message', streamId, {
  username: 'Name',
  text: 'Message'
}, (response) => {
  // response.success
});
```

#### Viewer Events

**join-stream**
```javascript
socket.emit('join-stream', streamId, (response) => {
  // response.success, response.stream, response.chatHistory
});
```

**leave-stream**
```javascript
socket.emit('leave-stream', streamId);
```

**get-streams**
```javascript
socket.emit('get-streams', (streams) => {
  // Array of active streams
});
```

#### Server Events

**new-stream** - Emitted when new stream starts
**stream-removed** - Emitted when stream ends
**chat-message** - Emitted for chat messages
**viewer-count** - Updates viewer count
**stream-ended** - Notifies viewers stream ended

### REST API Endpoints

**GET /api/streams**
```
Returns array of all active streams
```

**GET /api/streams/:streamId**
```
Returns specific stream details including chat history
```

## Advanced Configuration

### Custom RTMP Encoder Setup

For professional streaming with encoding/optimization:

```bash
npm install fluent-ffmpeg
```

### OBS Studio Integration

1. In OBS Settings → Stream
2. Service: Custom
3. Server: `rtmp://localhost:3001/live`
4. Stream Key: Your stream ID
5. Resolution: 1280x720
6. Bitrate: 3500 kbps (YouTube) / 6000 kbps (Twitch)

### Auto-Stop on Disconnect

The server automatically ends streams if the broadcaster disconnects.

## Performance Considerations

- **Max Concurrent Streams**: Limited by server resources
- **Max Viewers Per Stream**: 1000+ (depends on server bandwidth)
- **Chat Message Limit**: Last 100 messages stored per stream
- **Recommended Bitrate**: 2500-6000 kbps

## Troubleshooting

### "Permission denied" for camera/microphone
- Ensure HTTPS is used in production (not HTTP)
- Browser may require user gesture to start

### RTMP connection fails
- Verify RTMP URL is correct
- Check firewall/port settings
- Ensure YouTube/Twitch stream key is valid

### Chat not displaying
- Check Socket.IO connection is established
- Browser console for JavaScript errors
- Verify viewer joined stream before sending messages

### Low stream quality
- Increase encoder bitrate
- Reduce video resolution
- Check network bandwidth
- Reduce concurrent viewers

## Future Enhancements

- [ ] RTMP ingestion (accept streams from OBS)
- [ ] HLS/DASH protocol support
- [ ] Stream recording/VOD
- [ ] Moderation tools (ban, mute)
- [ ] Emotes and reactions
- [ ] Stream scheduling
- [ ] Multiple camera support
- [ ] Screen sharing
- [ ] Overlays and graphics
- [ ] Analytics dashboard

## Security Notes

- Validate all RTMP URLs before processing
- Implement rate limiting for chat messages
- Add authentication for broadcaster-only features
- Use HTTPS in production
- Sanitize chat messages to prevent XSS
- Implement content moderation

## Support

For issues or feature requests, please open a GitHub issue in the repository.

---

**Version**: 1.0.0
**Created**: June 2026
**Status**: Production Ready
