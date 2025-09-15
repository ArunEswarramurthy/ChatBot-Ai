import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Download, FileText, FileDown, Bot, User, ChevronDown, Code } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ApiResponseViewer from './ApiResponseViewer';

const ChatWindow = ({ 
  chat, 
  onSendMessage, 
  onUpgradeNeeded, 
  user,
  availableModels 
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [exportDropdown, setExportDropdown] = useState(false);
  const [apiViewer, setApiViewer] = useState({ open: false, response: null, endpoint: '' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.Messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdown && !event.target.closest('.export-dropdown')) {
        setExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportDropdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const messageText = message.trim();
    setMessage('');
    setLoading(true);

    try {
      await onSendMessage(messageText, selectedModel);
    } catch (error) {
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        onUpgradeNeeded(errorData.limitType, errorData.limit, errorData.current);
      } else {
        toast.error('Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'text') => {
    try {
      setExportDropdown(false);
      const response = await api.get(`/chats/${chat.id}/export?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let extension = 'txt';
      if (format === 'markdown') extension = 'md';
      if (format === 'pdf') extension = 'txt';
      
      link.setAttribute('download', `chat-${chat.title.replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Chat exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export chat');
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
          <p className="text-white/60">Select a chat or create a new one to get started</p>
        </div>
      </div>
    );
  }

  const maxMessages = user?.isPremium ? Infinity : 20;
  const messageCount = chat.Messages?.length || 0;
  const canSendMessage = messageCount < maxMessages;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages Area */}
      <div className="chat-messages">
        {chat.Messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-white/60">Send a message to begin chatting with AI</p>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {chat.Messages?.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="w-full mb-6"
                >
                  <div className={`flex items-start space-x-4 max-w-4xl mx-auto ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-button shadow-lg' 
                        : 'bg-white/10 border border-white/20 shadow-lg'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-5 h-5 text-black" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-sm">
                          {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        {msg.sender === 'ai' && msg.model && (
                          <span className="ml-2 text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                            {msg.model}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-white/40">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {msg.sender === 'user' ? (
                        <div className="bg-gradient-button text-black rounded-2xl px-4 py-3 shadow-lg">
                          <p className="whitespace-pre-wrap m-0 leading-relaxed">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="bg-black border border-green-500 rounded p-3 font-mono shadow-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-green-500 text-xs">$</span>
                            <span className="ml-2 text-green-400 text-xs">AI Response</span>
                          </div>
                          <p className="whitespace-pre-wrap text-green-400 text-sm leading-relaxed">{msg.text}</p>
                          <div className="mt-2">
                            <span className="text-green-500 animate-pulse">█</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-6"
              >
                <div className="flex items-start space-x-4 max-w-4xl mx-auto">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-sm">AI Assistant</span>
                      <span className="ml-2 text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                        {selectedModel}
                      </span>
                    </div>
                    
                    <div className="bg-black border border-green-500 rounded p-3 font-mono shadow-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 text-xs">$</span>
                        <span className="ml-2 text-green-400 text-xs">AI Thinking...</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="flex items-center justify-between mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="input-field text-sm py-2 px-3 bg-white/10 border border-white/20"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id} className="bg-gray-800">
                {model.name}
              </option>
            ))}
          </select>
          
          {chat && (
            <div className="relative export-dropdown">
              <button
                onClick={() => setExportDropdown(!exportDropdown)}
                className="flex items-center space-x-1 p-2 text-white/60 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {exportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 bottom-full mb-2 w-48 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => handleExport('text')}
                        className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export as Text</span>
                      </button>
                      <button
                        onClick={() => handleExport('markdown')}
                        className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center space-x-2"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Export as Markdown</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {!canSendMessage && !user?.isPremium && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium">
              💡 You've reached the 20 message limit for this chat. Upgrade to Premium for unlimited messages.
            </p>
            <button
              onClick={() => onUpgradeNeeded('messages', 20, messageCount)}
              className="mt-2 btn-primary text-sm py-1 px-3"
            >
              Upgrade Now
            </button>
          </div>
        )}
        
        <form onSubmit={handleSend} className="relative">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={canSendMessage ? "Message AI Assistant..." : "Upgrade to continue chatting"}
                className="w-full input-field py-4 pr-12 resize-none bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                disabled={!canSendMessage || loading}
              />
              
              <button
                type="submit"
                disabled={!message.trim() || loading || !canSendMessage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-button text-black rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {!user?.isPremium && (
            <p className="text-xs text-white/50 mt-2">
              {messageCount}/{maxMessages} messages used in this chat
              {messageCount >= 15 && (
                <span className="text-yellow-400 ml-2">
                  ⚠️ Approaching limit!
                </span>
              )}
            </p>
          )}
        </form>
      </div>

      <ApiResponseViewer
        isOpen={apiViewer.open}
        onClose={() => setApiViewer({ open: false, response: null, endpoint: '' })}
        response={apiViewer.response}
        endpoint={apiViewer.endpoint}
      />
    </div>
  );
};

export default ChatWindow;