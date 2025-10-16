import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../socket/SocketContext';
import { generateRoomId } from '../socket/utils';
import { getUser } from '../utils/helpers';
import {
  setConversations,
  addMessage,
  setMessages,
  setUnreadCount,
  addTypingUser,
  removeTypingUser,
  addOnlineUser,
  removeOnlineUser,
  markMessagesAsRead,
  setActiveRoomId,
} from '../store/slices/chatSlice';
import { RootState } from '../store';
import toast from 'react-hot-toast';

export const useChat = () => {
  const dispatch = useDispatch();
  const { eventManager, isConnected } = useSocket();
  const chatState = useSelector((state: RootState) => state.chat);
  const currentUser = getUser();
  const currentUserId = currentUser ? parseInt(currentUser.id) : null;

  // Setup event listeners
  useEffect(() => {
    if (!eventManager || !isConnected || !currentUserId) return;

    // Listen for new messages
    const unsubNewMessage = eventManager.listeners.onNewMessage((data) => {
      dispatch(addMessage(data));
      
      // Show notification if not in active room
      if (data.roomId !== chatState.activeRoomId && data.senderId !== currentUserId) {
        toast.success(`New message from ${data.senderId}`);
      }
    });

    // Listen for conversations list
    const unsubConversations = eventManager.listeners.onConversationsList((data) => {
      dispatch(setConversations(data.conversations));
    });

    // Listen for chat history
    const unsubChatHistory = eventManager.listeners.onChatHistory((data) => {
      const roomId = chatState.activeRoomId;
      if (roomId) {
        dispatch(setMessages({ roomId, messages: data.messages }));
      }
    });

    // Listen for unread count
    const unsubUnreadCount = eventManager.listeners.onUnreadCount((data) => {
      dispatch(setUnreadCount(data.unreadCount));
    });

    // Listen for typing indicator
    const unsubTyping = eventManager.listeners.onUserTyping((data) => {
      if (data.isTyping) {
        dispatch(addTypingUser({ roomId: data.roomId, userId: data.userId }));
      } else {
        dispatch(removeTypingUser({ roomId: data.roomId, userId: data.userId }));
      }
    });

    // Listen for user status
    const unsubUserStatus = eventManager.listeners.onUserStatus((data) => {
      if (data.status === 'online') {
        dispatch(addOnlineUser(data.userId));
      } else {
        dispatch(removeOnlineUser(data.userId));
      }
    });

    // Listen for messages read
    const unsubMessagesRead = eventManager.listeners.onMessagesRead((data) => {
      dispatch(markMessagesAsRead({ roomId: data.roomId }));
    });

    // Listen for errors
    const unsubError = eventManager.listeners.onError((data) => {
      toast.error(data.message);
    });

    return () => {
      unsubNewMessage();
      unsubConversations();
      unsubChatHistory();
      unsubUnreadCount();
      unsubTyping();
      unsubUserStatus();
      unsubMessagesRead();
      unsubError();
    };
  }, [eventManager, isConnected, currentUserId, chatState.activeRoomId, dispatch]);

  // Send message
  const sendMessage = useCallback((receiverId: number, message: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!eventManager || !currentUserId) return;

    eventManager.emitters.sendMessage({
      senderId: currentUserId,
      receiverId,
      message,
      type,
    });
  }, [eventManager, currentUserId]);

  // Get conversations
  const getConversations = useCallback(() => {
    if (!eventManager || !currentUserId) return;
    eventManager.emitters.getConversations({ userId: currentUserId });
  }, [eventManager, currentUserId]);

  // Get chat history
  const getChatHistory = useCallback((otherUserId: number, page = 1, limit = 50) => {
    if (!eventManager || !currentUserId) return;

    const roomId = generateRoomId(currentUserId, otherUserId);
    dispatch(setActiveRoomId(roomId));

    eventManager.emitters.getChatHistory({
      userId: currentUserId,
      otherUserId,
      page,
      limit,
    });
  }, [eventManager, currentUserId, dispatch]);

  // Mark as read
  const markAsRead = useCallback((senderId: number) => {
    if (!eventManager || !currentUserId) return;

    eventManager.emitters.markAsRead({
      senderId,
      receiverId: currentUserId,
    });
  }, [eventManager, currentUserId]);

  // Send typing indicator
  const sendTyping = useCallback((roomId: string, isTyping: boolean) => {
    if (!eventManager || !currentUserId) return;

    eventManager.emitters.typing({
      roomId,
      userId: currentUserId,
      isTyping,
    });
  }, [eventManager, currentUserId]);

  // Get unread count
  const getUnreadCount = useCallback(() => {
    if (!eventManager || !currentUserId) return;
    eventManager.emitters.getUnreadCount({ userId: currentUserId });
  }, [eventManager, currentUserId]);

  // Join room
  const joinRoom = useCallback((otherUserId: number) => {
    if (!eventManager || !currentUserId) return;

    eventManager.emitters.joinRoom({
      userId: currentUserId,
      otherUserId,
    });

    const roomId = generateRoomId(currentUserId, otherUserId);
    dispatch(setActiveRoomId(roomId));
  }, [eventManager, currentUserId, dispatch]);

  // Leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (!eventManager) return;

    eventManager.emitters.leaveRoom({ roomId });
    dispatch(setActiveRoomId(null));
  }, [eventManager, dispatch]);

  return {
    ...chatState,
    isConnected,
    currentUserId,
    sendMessage,
    getConversations,
    getChatHistory,
    markAsRead,
    sendTyping,
    getUnreadCount,
    joinRoom,
    leaveRoom,
  };
};
