import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { generateRoomId } from '../../socket/utils';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { User, Phone, Video, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  userId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId }) => {
  const { currentUserId, joinRoom, leaveRoom, getChatHistory, messages, conversations } = useChat();
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const newRoomId = generateRoomId(currentUserId, userId);
    setRoomId(newRoomId);

    joinRoom(userId);
    getChatHistory(userId);

    return () => {
      if (newRoomId) {
        leaveRoom(newRoomId);
      }
    };
  }, [userId, currentUserId, joinRoom, leaveRoom, getChatHistory]);

  const conversation = conversations.find((c) => c.user.id === userId);
  const roomMessages = roomId ? messages[roomId] || [] : [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {conversation?.user.name
              ? conversation.user.name.charAt(0).toUpperCase()
              : conversation?.user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation?.user.name || conversation?.user.email}
            </h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={roomMessages} currentUserId={currentUserId || 0} />

      {/* Input */}
      <MessageInput receiverId={userId} roomId={roomId || ''} />
    </div>
  );
};

export default ChatWindow;
