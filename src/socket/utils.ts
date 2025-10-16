/**
 * Generate a unique room ID for two users
 * The room ID is always generated with the smaller user ID first
 * to ensure consistency regardless of who initiates the chat
 * 
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @returns Unique room ID in format "userId1__**__userId2"
 */
export const generateRoomId = (userId1: number, userId2: number): string => {
  const sortedIds = [userId1, userId2].sort((a, b) => a - b);
  return `${sortedIds[0]}__**__${sortedIds[1]}`;
};

/**
 * Extract user IDs from a room ID
 * 
 * @param roomId - Room ID in format "userId1__**__userId2"
 * @returns Array of two user IDs
 */
export const extractUserIdsFromRoomId = (roomId: string): [number, number] => {
  const parts = roomId.split('__**__');
  if (parts.length !== 2) {
    throw new Error('Invalid room ID format');
  }
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
};

/**
 * Get the other user ID from a room ID given the current user ID
 * 
 * @param roomId - Room ID
 * @param currentUserId - Current user's ID
 * @returns The other user's ID
 */
export const getOtherUserIdFromRoom = (roomId: string, currentUserId: number): number => {
  const [userId1, userId2] = extractUserIdsFromRoomId(roomId);
  return userId1 === currentUserId ? userId2 : userId1;
};

/**
 * Format timestamp to readable time
 * 
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Format timestamp to full date and time
 * 
 * @param timestamp - ISO timestamp string
 * @returns Formatted date and time string
 */
export const formatMessageDateTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Group messages by date
 * 
 * @param messages - Array of messages
 * @returns Object with dates as keys and arrays of messages as values
 */
export const groupMessagesByDate = (messages: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    const dateKey = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
};

/**
 * Check if a message is from the current user
 * 
 * @param message - Message object
 * @param currentUserId - Current user's ID
 * @returns True if message is from current user
 */
export const isMessageFromCurrentUser = (message: any, currentUserId: number): boolean => {
  return message.senderId === currentUserId;
};

/**
 * Get unread message count for a conversation
 * 
 * @param messages - Array of messages
 * @param currentUserId - Current user's ID
 * @returns Number of unread messages
 */
export const getUnreadMessageCount = (messages: any[], currentUserId: number): number => {
  return messages.filter(
    (msg) => msg.receiverId === currentUserId && msg.status !== 'read'
  ).length;
};

/**
 * Truncate message text for preview
 * 
 * @param text - Message text
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated text
 */
export const truncateMessage = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Sort conversations by last message timestamp
 * 
 * @param conversations - Array of conversations
 * @returns Sorted conversations (newest first)
 */
export const sortConversationsByLastMessage = (conversations: any[]): any[] => {
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a.lastMessage.createdAt).getTime();
    const dateB = new Date(b.lastMessage.createdAt).getTime();
    return dateB - dateA;
  });
};

/**
 * Validate message content
 * 
 * @param message - Message text
 * @returns True if message is valid
 */
export const isValidMessage = (message: string): boolean => {
  return message.trim().length > 0;
};

/**
 * Get message status icon/color
 * 
 * @param status - Message status
 * @returns Object with icon and color
 */
export const getMessageStatusInfo = (status: 'sent' | 'delivered' | 'read'): {
  icon: string;
  color: string;
} => {
  switch (status) {
    case 'sent':
      return { icon: '✓', color: 'text-gray-400' };
    case 'delivered':
      return { icon: '✓✓', color: 'text-gray-400' };
    case 'read':
      return { icon: '✓✓', color: 'text-blue-500' };
    default:
      return { icon: '', color: '' };
  }
};
