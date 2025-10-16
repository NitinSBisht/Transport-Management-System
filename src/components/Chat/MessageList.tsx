import React, { useEffect, useRef } from 'react';
import { Message } from '../../socket/types';
import { formatMessageDateTime, groupMessagesByDate } from '../../socket/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {date}
            </div>
          </div>

          {/* Messages */}
          {msgs.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
          }`}
        >
          <p className="text-sm break-words">{message.message}</p>
          <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{new Date(message.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
            {isCurrentUser && (
              <span>
                {message.status === 'read' ? (
                  <CheckCheck className="w-4 h-4 text-blue-200" />
                ) : message.status === 'delivered' ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
