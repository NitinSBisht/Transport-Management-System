import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';

interface MessageInputProps {
  receiverId: number;
  roomId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ receiverId, roomId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, sendTyping } = useChat();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(roomId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(roomId, false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(receiverId, message.trim());
      setMessage('');
      
      if (isTyping) {
        setIsTyping(false);
        sendTyping(roomId, false);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        sendTyping(roomId, false);
      }
    };
  }, [roomId, isTyping, sendTyping]);

  return (
    <div className="border-t border-gray-200 px-6 py-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
            style={{ minHeight: '40px' }}
          />
        </div>

        {/* Emoji Button */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Send/Voice Button */}
        {message.trim() ? (
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
