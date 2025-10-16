import React from 'react';
import { Conversation } from '../../socket/types';
import { formatMessageTime, truncateMessage } from '../../socket/utils';
import { Search, User } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedUserId: number | null;
  onSelectConversation: (userId: number) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedUserId,
  onSelectConversation,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <User className="w-12 h-12 mb-2" />
            <p>No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.roomId}
              conversation={conversation}
              isSelected={conversation.user.id === selectedUserId}
              onClick={() => onSelectConversation(conversation.user.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const { user, lastMessage, unreadCount } = conversation;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {user.name || user.email}
          </h3>
          <span className="text-xs text-gray-500">
            {formatMessageTime(lastMessage.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {lastMessage.isFromMe && <span className="text-gray-400">You: </span>}
            {truncateMessage(lastMessage.message, 30)}
          </p>
          {unreadCount && unreadCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
