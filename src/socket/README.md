# Socket.IO Chat Module - Frontend Integration

## Overview
This module provides a complete Socket.IO chat implementation for the TMS application, including real-time messaging, typing indicators, online status, and message management.

## Installation

First, install the required dependency:

```bash
npm install socket.io-client
```

## Project Structure

```
src/
├── socket/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript interfaces and types
│   ├── utils.ts              # Utility functions (room ID generation, formatting)
│   ├── events.ts             # Socket event emitters and listeners
│   ├── connection.ts         # Socket connection manager
│   └── SocketContext.tsx     # React context provider
├── store/slices/
│   └── chatSlice.ts          # Redux slice for chat state
├── hooks/
│   └── useChat.ts            # Custom hook for chat operations
├── components/Chat/
│   ├── ConversationList.tsx  # List of conversations
│   ├── ChatWindow.tsx        # Main chat window
│   ├── MessageList.tsx       # Message display
│   └── MessageInput.tsx      # Message input field
└── pages/Chat/
    └── index.tsx             # Chat page component
```

## Setup

### 1. Update App.tsx

Wrap your app with the `SocketProvider`:

```tsx
import { SocketProvider } from './socket';

function App() {
  return (
    <SocketProvider>
      {/* Your app components */}
    </SocketProvider>
  );
}
```

### 2. Add Chat Route

Add the chat route to your routing configuration:

```tsx
import ChatPage from './pages/Chat';

// In your routes
<Route path="/chat" element={<ChatPage />} />
```

### 3. Configure Socket URL

The socket URL is automatically derived from your API base URL in `src/config/index.ts`. It removes the `/api` suffix.

Example:
- API URL: `http://localhost:5000/api`
- Socket URL: `http://localhost:5000`

## Usage

### Basic Chat Implementation

```tsx
import { useChat } from '../hooks/useChat';
import { useSocket } from '../socket';

function ChatComponent() {
  const { connect, disconnect, isConnected } = useSocket();
  const { 
    conversations, 
    messages, 
    sendMessage, 
    getConversations,
    getChatHistory 
  } = useChat();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (isConnected) {
      getConversations();
    }
  }, [isConnected]);

  const handleSendMessage = (receiverId: number, text: string) => {
    sendMessage(receiverId, text);
  };

  return (
    <div>
      {/* Your chat UI */}
    </div>
  );
}
```

### Available Hooks

#### `useSocket()`
Provides socket connection management:
- `socket`: Socket instance
- `isConnected`: Connection status
- `connect()`: Connect to socket server
- `disconnect()`: Disconnect from socket server
- `eventManager`: Access to event emitters and listeners

#### `useChat()`
Provides chat operations and state:
- `conversations`: List of conversations
- `messages`: Messages by room ID
- `activeRoomId`: Current active chat room
- `unreadCount`: Total unread messages
- `onlineUsers`: Array of online user IDs
- `typingUsers`: Users currently typing
- `sendMessage(receiverId, message, type)`: Send a message
- `getConversations()`: Fetch all conversations
- `getChatHistory(otherUserId, page, limit)`: Get chat history
- `markAsRead(senderId)`: Mark messages as read
- `sendTyping(roomId, isTyping)`: Send typing indicator
- `joinRoom(otherUserId)`: Join a chat room
- `leaveRoom(roomId)`: Leave a chat room

## Key Features

### 1. Real-time Messaging
Messages are sent and received in real-time using Socket.IO events.

### 2. Typing Indicators
Shows when the other user is typing with automatic timeout.

### 3. Read Receipts
Messages show status: sent (✓), delivered (✓✓), read (✓✓ blue).

### 4. Online Status
Track which users are currently online.

### 5. Unread Count
Badge showing total unread messages across all conversations.

### 6. Message History
Paginated chat history with date grouping.

### 7. Auto-reconnection
Automatic reconnection with exponential backoff on connection loss.

## Socket Events

### Client → Server
- `user_online`: Announce user is online
- `user_offline`: Announce user is offline
- `join_room`: Join a chat room
- `leave_room`: Leave a chat room
- `send_message`: Send a message
- `get_chat_history`: Get message history
- `get_conversations`: Get all conversations
- `mark_as_read`: Mark messages as read
- `typing`: Send typing indicator
- `get_unread_count`: Get unread message count

### Server → Client
- `user_status`: User online/offline status
- `new_message`: New message received
- `message_sent`: Message sent confirmation
- `chat_history`: Chat history response
- `conversations_list`: Conversations list
- `messages_read`: Messages marked as read
- `user_typing`: Typing indicator
- `unread_count`: Unread count response
- `error`: Error notification

## Utility Functions

### Room ID Generation
```tsx
import { generateRoomId } from './socket/utils';

const roomId = generateRoomId(userId1, userId2);
// Always generates consistent room ID: "123__**__456"
```

### Message Formatting
```tsx
import { formatMessageTime, truncateMessage } from './socket/utils';

const time = formatMessageTime(message.createdAt); // "2m ago"
const preview = truncateMessage(message.text, 50); // "Hello world..."
```

## Redux State Structure

```typescript
{
  chat: {
    conversations: Conversation[],
    messages: { [roomId: string]: Message[] },
    activeRoomId: string | null,
    unreadCount: number,
    typingUsers: { [roomId: string]: number[] },
    onlineUsers: number[],
    isLoading: boolean
  }
}
```

## Customization

### Styling
All components use Tailwind CSS. Modify classes in component files to match your design system.

### Socket URL
Override the socket URL by passing it to `SocketProvider`:

```tsx
<SocketProvider socketUrl="https://your-socket-server.com">
  {children}
</SocketProvider>
```

### Message Types
Extend message types in `socket/types.ts`:
- `text`: Plain text messages
- `image`: Image messages
- `file`: File attachments

## Error Handling

Errors are automatically displayed using `react-hot-toast`. Customize error handling in `hooks/useChat.ts`:

```tsx
eventManager.listeners.onError((data) => {
  toast.error(data.message);
  // Add custom error handling
});
```

## Performance Optimization

1. **Message Pagination**: Chat history is paginated (default 50 messages)
2. **Lazy Loading**: Messages load on demand
3. **Optimistic Updates**: Messages appear immediately before server confirmation
4. **Debounced Typing**: Typing indicators use 2-second debounce
5. **Auto-scroll**: Messages auto-scroll to bottom on new message

## Security Considerations

1. **Authentication**: Socket connects only for authenticated users
2. **Authorization**: Users can only access their own conversations
3. **Input Validation**: All inputs are validated before sending
4. **XSS Protection**: Messages are sanitized before rendering

## Troubleshooting

### Socket Not Connecting
- Check if socket URL is correct in config
- Verify backend server is running
- Check browser console for connection errors

### Messages Not Sending
- Ensure socket is connected (`isConnected === true`)
- Verify user is authenticated
- Check network tab for socket events

### Typing Indicator Not Working
- Ensure both users are in the same room
- Check if `sendTyping` is being called
- Verify room ID is correct

## Example: Complete Chat Page

See `src/pages/Chat/index.tsx` for a complete implementation example.

## API Reference

For detailed backend API documentation, see the main chat system documentation.
