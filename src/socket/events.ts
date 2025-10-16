import { Socket } from 'socket.io-client';
import {
  SOCKET_EVENTS,
  UserOnlinePayload,
  JoinRoomPayload,
  SendMessagePayload,
  GetChatHistoryPayload,
  GetConversationsPayload,
  MarkAsReadPayload,
  DeleteMessagePayload,
  GetUnreadCountPayload,
  TypingPayload,
  LeaveRoomPayload,
  UserStatusResponse,
  UserJoinedRoomResponse,
  MessageSentResponse,
  NewMessageResponse,
  ChatHistoryResponse,
  ConversationsListResponse,
  MessagesReadResponse,
  MessageDeletedResponse,
  UnreadCountResponse,
  UserTypingResponse,
  SocketErrorResponse,
} from './types';

/**
 * Socket Event Emitters - Client to Server
 */
export class SocketEmitters {
  constructor(private socket: Socket) {}

  /**
   * Announce user is online
   */
  userOnline(userId: number): void {
    this.socket.emit(SOCKET_EVENTS.USER_ONLINE, userId);
  }

  /**
   * Announce user is going offline
   */
  userOffline(userId: number): void {
    this.socket.emit(SOCKET_EVENTS.USER_OFFLINE, userId);
  }

  /**
   * Join a chat room with another user
   */
  joinRoom(payload: JoinRoomPayload): void {
    this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, payload);
  }

  /**
   * Leave a chat room
   */
  leaveRoom(payload: LeaveRoomPayload): void {
    this.socket.emit(SOCKET_EVENTS.LEAVE_ROOM, payload);
  }

  /**
   * Send a message to another user
   */
  sendMessage(payload: SendMessagePayload): void {
    this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  }

  /**
   * Get chat history with another user
   */
  getChatHistory(payload: GetChatHistoryPayload): void {
    this.socket.emit(SOCKET_EVENTS.GET_CHAT_HISTORY, payload);
  }

  /**
   * Get list of all conversations
   */
  getConversations(payload: GetConversationsPayload): void {
    this.socket.emit(SOCKET_EVENTS.GET_CONVERSATIONS, payload);
  }

  /**
   * Mark messages as read
   */
  markAsRead(payload: MarkAsReadPayload): void {
    this.socket.emit(SOCKET_EVENTS.MARK_AS_READ, payload);
  }

  /**
   * Delete a message
   */
  deleteMessage(payload: DeleteMessagePayload): void {
    this.socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, payload);
  }

  /**
   * Get unread message count
   */
  getUnreadCount(payload: GetUnreadCountPayload): void {
    this.socket.emit(SOCKET_EVENTS.GET_UNREAD_COUNT, payload);
  }

  /**
   * Send typing indicator
   */
  typing(payload: TypingPayload): void {
    this.socket.emit(SOCKET_EVENTS.TYPING, payload);
  }
}

/**
 * Socket Event Listeners - Server to Client
 */
export class SocketListeners {
  constructor(private socket: Socket) {}

  /**
   * Listen for user status changes (online/offline)
   */
  onUserStatus(callback: (data: UserStatusResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.USER_STATUS, callback);
    return () => this.socket.off(SOCKET_EVENTS.USER_STATUS, callback);
  }

  /**
   * Listen for user joined room event
   */
  onUserJoinedRoom(callback: (data: UserJoinedRoomResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.USER_JOINED_ROOM, callback);
    return () => this.socket.off(SOCKET_EVENTS.USER_JOINED_ROOM, callback);
  }

  /**
   * Listen for message sent confirmation
   */
  onMessageSent(callback: (data: MessageSentResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.MESSAGE_SENT, callback);
    return () => this.socket.off(SOCKET_EVENTS.MESSAGE_SENT, callback);
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (data: NewMessageResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.NEW_MESSAGE, callback);
    return () => this.socket.off(SOCKET_EVENTS.NEW_MESSAGE, callback);
  }

  /**
   * Listen for chat history response
   */
  onChatHistory(callback: (data: ChatHistoryResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.CHAT_HISTORY, callback);
    return () => this.socket.off(SOCKET_EVENTS.CHAT_HISTORY, callback);
  }

  /**
   * Listen for conversations list response
   */
  onConversationsList(callback: (data: ConversationsListResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.CONVERSATIONS_LIST, callback);
    return () => this.socket.off(SOCKET_EVENTS.CONVERSATIONS_LIST, callback);
  }

  /**
   * Listen for messages read event
   */
  onMessagesRead(callback: (data: MessagesReadResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.MESSAGES_READ, callback);
    return () => this.socket.off(SOCKET_EVENTS.MESSAGES_READ, callback);
  }

  /**
   * Listen for message deleted event
   */
  onMessageDeleted(callback: (data: MessageDeletedResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.MESSAGE_DELETED, callback);
    return () => this.socket.off(SOCKET_EVENTS.MESSAGE_DELETED, callback);
  }

  /**
   * Listen for unread count response
   */
  onUnreadCount(callback: (data: UnreadCountResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.UNREAD_COUNT, callback);
    return () => this.socket.off(SOCKET_EVENTS.UNREAD_COUNT, callback);
  }

  /**
   * Listen for typing indicator
   */
  onUserTyping(callback: (data: UserTypingResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.USER_TYPING, callback);
    return () => this.socket.off(SOCKET_EVENTS.USER_TYPING, callback);
  }

  /**
   * Listen for socket errors
   */
  onError(callback: (data: SocketErrorResponse) => void): () => void {
    this.socket.on(SOCKET_EVENTS.ERROR, callback);
    return () => this.socket.off(SOCKET_EVENTS.ERROR, callback);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    Object.values(SOCKET_EVENTS).forEach((event) => {
      this.socket.off(event);
    });
  }
}

/**
 * Combined Socket Event Manager
 */
export class SocketEventManager {
  public emitters: SocketEmitters;
  public listeners: SocketListeners;

  constructor(socket: Socket) {
    this.emitters = new SocketEmitters(socket);
    this.listeners = new SocketListeners(socket);
  }

  /**
   * Clean up all event listeners
   */
  cleanup(): void {
    this.listeners.removeAllListeners();
  }
}
