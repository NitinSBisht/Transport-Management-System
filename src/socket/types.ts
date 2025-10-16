// Message Types
export type MessageType = 'text' | 'image' | 'file';
export type MessageStatus = 'sent' | 'delivered' | 'read';

// Message Interface
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  roomId: string;
  message: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// User Info for Conversations
export interface ConversationUser {
  id: number;
  email: string;
  phoneNumber?: string;
  name?: string;
}

// Last Message in Conversation
export interface LastMessage {
  message: string;
  createdAt: string;
  status: MessageStatus;
  isFromMe: boolean;
}

// Conversation Interface
export interface Conversation {
  roomId: string;
  user: ConversationUser;
  lastMessage: LastMessage;
  unreadCount?: number;
}

// Pagination Info
export interface PaginationInfo {
  totalRecords: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

// Socket Event Payloads - Client to Server
export interface UserOnlinePayload {
  userId: number;
}

export interface JoinRoomPayload {
  userId: number;
  otherUserId: number;
}

export interface SendMessagePayload {
  senderId: number;
  receiverId: number;
  message: string;
  type?: MessageType;
}

export interface GetChatHistoryPayload {
  userId: number;
  otherUserId: number;
  page?: number;
  limit?: number;
}

export interface GetConversationsPayload {
  userId: number;
}

export interface MarkAsReadPayload {
  senderId: number;
  receiverId: number;
}

export interface DeleteMessagePayload {
  messageId: number;
  userId: number;
}

export interface GetUnreadCountPayload {
  userId: number;
}

export interface TypingPayload {
  roomId: string;
  userId: number;
  isTyping: boolean;
}

export interface LeaveRoomPayload {
  roomId: string;
}

// Socket Event Responses - Server to Client
export interface UserStatusResponse {
  userId: number;
  status: 'online' | 'offline';
}

export interface UserJoinedRoomResponse {
  userId: number;
  roomId: string;
}

export interface MessageSentResponse extends Message {}

export interface NewMessageResponse extends Message {}

export interface ChatHistoryResponse {
  messages: Message[];
  pagination: PaginationInfo;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
}

export interface MessagesReadResponse {
  roomId: string;
  senderId: number;
  receiverId: number;
  readAt: string;
  updatedCount: number;
}

export interface MessageDeletedResponse {
  messageId: number;
  roomId: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface UserTypingResponse {
  userId: number;
  roomId: string;
  isTyping: boolean;
}

export interface SocketErrorResponse {
  message: string;
  code?: string;
}

// Socket Event Names
export const SOCKET_EVENTS = {
  // Client to Server
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  GET_CHAT_HISTORY: 'get_chat_history',
  GET_CONVERSATIONS: 'get_conversations',
  MARK_AS_READ: 'mark_as_read',
  DELETE_MESSAGE: 'delete_message',
  GET_UNREAD_COUNT: 'get_unread_count',
  TYPING: 'typing',

  // Server to Client
  USER_STATUS: 'user_status',
  USER_JOINED_ROOM: 'user_joined_room',
  MESSAGE_SENT: 'message_sent',
  NEW_MESSAGE: 'new_message',
  CHAT_HISTORY: 'chat_history',
  CONVERSATIONS_LIST: 'conversations_list',
  MESSAGES_READ: 'messages_read',
  MESSAGE_DELETED: 'message_deleted',
  UNREAD_COUNT: 'unread_count',
  USER_TYPING: 'user_typing',
  ERROR: 'error',
} as const;

// Socket Connection Status
export type SocketConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Socket Context State
export interface SocketContextState {
  socket: any | null;
  isConnected: boolean;
  connectionStatus: SocketConnectionStatus;
  currentRoomId: string | null;
  onlineUsers: number[];
  typingUsers: Record<string, number[]>; // roomId -> array of userIds
}
