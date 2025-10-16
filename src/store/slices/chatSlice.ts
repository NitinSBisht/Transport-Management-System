import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Conversation } from '../../socket/types';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // roomId -> messages
  activeRoomId: string | null;
  unreadCount: number;
  typingUsers: Record<string, number[]>; // roomId -> userIds
  onlineUsers: number[];
  isLoading: boolean;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeRoomId: null,
  unreadCount: 0,
  typingUsers: {},
  onlineUsers: [],
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const exists = state.conversations.find(c => c.roomId === action.payload.roomId);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(c => c.roomId === action.payload.roomId);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    setMessages: (state, action: PayloadAction<{ roomId: string; messages: Message[] }>) => {
      state.messages[action.payload.roomId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { roomId } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const { roomId, id } = action.payload;
      if (state.messages[roomId]) {
        const index = state.messages[roomId].findIndex(m => m.id === id);
        if (index !== -1) {
          state.messages[roomId][index] = action.payload;
        }
      }
    },
    deleteMessage: (state, action: PayloadAction<{ roomId: string; messageId: number }>) => {
      const { roomId, messageId } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].filter(m => m.id !== messageId);
      }
    },
    setActiveRoomId: (state, action: PayloadAction<string | null>) => {
      state.activeRoomId = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, state.unreadCount - action.payload);
    },
    setTypingUsers: (state, action: PayloadAction<{ roomId: string; userIds: number[] }>) => {
      state.typingUsers[action.payload.roomId] = action.payload.userIds;
    },
    addTypingUser: (state, action: PayloadAction<{ roomId: string; userId: number }>) => {
      const { roomId, userId } = action.payload;
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = [];
      }
      if (!state.typingUsers[roomId].includes(userId)) {
        state.typingUsers[roomId].push(userId);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ roomId: string; userId: number }>) => {
      const { roomId, userId } = action.payload;
      if (state.typingUsers[roomId]) {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(id => id !== userId);
      }
    },
    setOnlineUsers: (state, action: PayloadAction<number[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<number>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<number>) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    markMessagesAsRead: (state, action: PayloadAction<{ roomId: string }>) => {
      const { roomId } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].map(msg => ({
          ...msg,
          status: 'read',
        }));
      }
    },
    clearChat: (state) => {
      return initialState;
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setActiveRoomId,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setLoading,
  markMessagesAsRead,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
