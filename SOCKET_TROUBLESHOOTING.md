# Socket Connection Troubleshooting

## Issue: Continuous Polling in Network Tab

If you see continuous requests in the Network tab (polling), it means the WebSocket connection is not being established properly.

## ✅ Fixes Applied

### 1. **Prevent Multiple Connections**
- Updated `SocketContext.tsx` to check if already connected before connecting
- Added connection state checks to prevent duplicate connections

### 2. **WebSocket-Only Transport**
- Changed `connection.ts` to use only WebSocket transport
- Disabled polling fallback: `transports: ['websocket']`
- This prevents the continuous HTTP polling you're seeing

### 3. **Single Connection Instance**
- Updated `ChatPage` to connect only once on mount
- Connection stays alive across page navigation
- No disconnect on unmount to maintain persistent connection

### 4. **Better Error Logging**
- Added console logs to track connection status
- Check browser console for connection messages

## 🔍 How to Debug

### 1. Check Browser Console
Open DevTools Console (F12) and look for:
```
[Socket] Connecting to chat server...
[Socket] Successfully connected
```

Or errors:
```
[Socket] Connection error: <error message>
[Socket] No user found, cannot connect
```

### 2. Check Network Tab
**What you should see:**
- Initial WebSocket connection request (Status: 101 Switching Protocols)
- WebSocket stays open (shows as "pending" or green)
- No continuous polling requests

**What indicates a problem:**
- Continuous polling requests (xhr_polling)
- WebSocket connection fails immediately
- Red/failed WebSocket requests

### 3. Verify Backend Configuration

Your backend Socket.IO server must:

```javascript
// Example backend setup
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket'], // Match frontend
  allowUpgrades: false
});
```

## 🛠️ Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Connection fails, CORS error in console

**Solution**: Update backend CORS settings
```javascript
cors: {
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true
}
```

### Issue 2: Wrong URL
**Symptom**: Connection timeout, 404 errors

**Solution**: Check `.env` file
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Socket URL will be: `http://localhost:5000` (removes `/api`)

### Issue 3: Backend Not Running Socket.IO
**Symptom**: Connection refused, no WebSocket upgrade

**Solution**: Ensure Socket.IO is initialized on backend
```javascript
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(5000); // Not app.listen()
```

### Issue 4: Firewall/Proxy Blocking WebSocket
**Symptom**: WebSocket fails, falls back to polling

**Solution**: 
- Check firewall settings
- If behind proxy, configure proxy to allow WebSocket
- Temporarily test with polling enabled to confirm:
  ```typescript
  transports: ['websocket', 'polling']
  ```

### Issue 5: User Not Authenticated
**Symptom**: Console shows "No user found, cannot connect"

**Solution**: 
- Ensure user is logged in
- Check localStorage for user data
- Verify `getUser()` returns valid user object

## 📊 Expected Network Activity

### Normal WebSocket Connection:
```
1. Initial HTTP request to /socket.io/?EIO=4&transport=websocket
2. Status: 101 Switching Protocols
3. Connection stays open (shows as pending)
4. Occasional ping/pong frames (keep-alive)
```

### Abnormal (Polling - What You're Seeing):
```
1. Continuous requests to /socket.io/?EIO=4&transport=polling
2. Multiple xhr_polling requests
3. High network activity
4. Connection never upgrades to WebSocket
```

## 🎯 Quick Fix Checklist

- [ ] Backend Socket.IO server is running
- [ ] Backend CORS allows your frontend origin
- [ ] Backend uses same transport: `transports: ['websocket']`
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] User is logged in (check localStorage)
- [ ] No firewall blocking WebSocket connections
- [ ] Backend server uses `http.createServer()` not just `app.listen()`

## 🧪 Test Backend Connection

### Using Browser Console:
```javascript
// Test if backend is reachable
fetch('http://localhost:5000/socket.io/?EIO=4&transport=polling')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

### Using curl:
```bash
curl http://localhost:5000/socket.io/?EIO=4&transport=polling
```

Should return something like: `0{"sid":"...","upgrades":["websocket"],...}`

## 📝 Console Logs to Check

After the fixes, you should see:
```
[Socket] Connecting to chat server...
[Socket] Successfully connected
```

If you see:
```
[Socket] Already connected, skipping...
```
This is good - it means it's preventing duplicate connections.

If you see:
```
[Socket] Connection error: ...
```
Check the error message for specific issues.

## 🔄 After Making Changes

1. **Restart your dev server**: `npm run dev`
2. **Hard refresh browser**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Clear browser cache** if needed
4. **Check console** for connection logs
5. **Check Network tab** - should see WebSocket, not polling

## ✅ Success Indicators

You'll know it's working when:
- ✅ Console shows "Successfully connected"
- ✅ Network tab shows WebSocket connection (Status: 101)
- ✅ WebSocket stays open (pending)
- ✅ No continuous polling requests
- ✅ Green dot in chat interface
- ✅ Can send/receive messages

## 🆘 Still Having Issues?

1. Share the console error messages
2. Share Network tab screenshot
3. Verify backend Socket.IO configuration
4. Check if backend is accessible at all (try API endpoints)
5. Try with polling enabled temporarily to isolate WebSocket issue
