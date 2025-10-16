import React, { useEffect, useState } from 'react';
import { useSocket } from '../../socket/SocketContext';
import { useChat } from '../../hooks/useChat';
import ConversationList from '../../components/Chat/ConversationList';
import ChatWindow from '../../components/Chat/ChatWindow';
import { MessageCircle } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { connect, disconnect, isConnected } = useSocket();
  const { getConversations, conversations } = useChat();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    // Only connect if not already connected
    if (!isConnected) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      // Don't disconnect on unmount to keep connection alive
      // disconnect();
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (isConnected) {
      getConversations();
    }
  }, [isConnected, getConversations]);

  return (
    <div className="-m-8 h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <ConversationList
            conversations={conversations}
            selectedUserId={selectedUserId}
            onSelectConversation={setSelectedUserId}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <ChatWindow userId={selectedUserId} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-500">
                  Select a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
