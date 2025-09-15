import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Trash2, Plus } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// Simple date formatting utility
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const ChatList = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat, 
  user 
}) => {
  const maxChats = user?.isPremium ? Infinity : 20;
  const canCreateNew = chats.length < maxChats;

  return (
    <div className="sidebar h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewChat}
          disabled={!canCreateNew}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
            canCreateNew 
              ? 'btn-primary hover:scale-105' 
              : 'bg-white/5 text-white/50 cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
        
        {!user?.isPremium && (
          <div className="mt-3 text-center">
            <p className="text-xs text-white/60">
              {chats.length}/{maxChats} chats used
            </p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-1">
              <div 
                className="bg-gradient-button h-2 rounded-full transition-all duration-300"
                style={{ width: `${(chats.length / maxChats) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`chat-item group relative ${
              activeChat?.id === chat.id ? 'active' : ''
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-gradient-cyan flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{chat.title}</h3>
                <p className="text-xs text-white/60 mt-1">
                  {chat.Messages?.length > 0 
                    ? formatDistanceToNow(new Date(chat.updatedAt))
                    : 'No messages yet'
                  }
                </p>
                {chat.Messages?.length > 0 && (
                  <p className="text-xs text-white/50 mt-1 truncate">
                    {chat.Messages[0].text}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        
        {chats.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60">No chats yet</p>
            <p className="text-sm text-white/40 mt-1">
              Create your first chat to get started
            </p>
          </div>
        )}
      </div>

      {user && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-button rounded-full flex items-center justify-center">
              <span className="text-black font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/60">
                {user.isPremium ? 'Premium' : 'Free'} Plan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;