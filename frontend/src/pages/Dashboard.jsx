import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, Crown, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import UpgradePopup from '../components/UpgradePopup';
import ProfileModal from '../components/ProfileModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [upgradePopup, setUpgradePopup] = useState({ open: false });
  const [profileModal, setProfileModal] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    fetchModels();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats');
      setChats(response.data);
    } catch (error) {
      toast.error('Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await api.get('/chats/models');
      setAvailableModels(response.data);
    } catch (error) {
      console.error('Failed to fetch models');
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await api.post('/chats', { title: 'New Chat' });
      const newChat = { ...response.data, Messages: [] };
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
    } catch (error) {
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        setUpgradePopup({
          open: true,
          limitType: errorData.limitType,
          limit: errorData.limit,
          current: errorData.current
        });
      } else {
        toast.error('Failed to create chat');
      }
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      const response = await api.get(`/chats/${chat.id}`);
      setActiveChat(response.data);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await api.delete(`/chats/${chatId}`);
      setChats(chats.filter(chat => chat.id !== chatId));
      if (activeChat?.id === chatId) {
        setActiveChat(null);
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const handleSendMessage = async (text, model) => {
    if (!activeChat) return;

    try {
      const response = await api.post(`/chats/${activeChat.id}/messages`, {
        text,
        model
      });

      const updatedChat = {
        ...activeChat,
        Messages: [...(activeChat.Messages || []), response.data.userMessage, response.data.aiMessage],
        title: response.data.chat.title
      };

      setActiveChat(updatedChat);
      
      // Update chat in list
      setChats(chats.map(chat => 
        chat.id === activeChat.id 
          ? { ...chat, title: response.data.chat.title, updatedAt: new Date().toISOString() }
          : chat
      ));
    } catch (error) {
      throw error; // Re-throw to handle in ChatWindow
    }
  };

  const handleUpgradeNeeded = (limitType, limit, current) => {
    setUpgradePopup({ open: true, limitType, limit, current });
  };

  const handleUpgrade = async () => {
    try {
      const response = await api.post('/stripe/create-session');
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gradient-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className="fixed lg:relative z-50 chat-sidebar lg:translate-x-0"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-white">ChatGPT</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center space-x-2 py-3 rounded-lg border border-gray-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                onClick={() => handleChatSelect(chat)}
                className={`cursor-pointer p-3 rounded-lg transition-all group ${
                  activeChat?.id === chat.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-white text-sm">
                      {chat.title || 'New Chat'}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="ml-2 p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {!user?.isPremium && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300 mb-2">
                {chats.length}/20 chats used
              </p>
              <button
                onClick={handleUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-button rounded-full flex items-center justify-center">
                <span className="text-black font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-white/60">
                  {user?.isPremium ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setProfileModal(true)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={logout}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="chat-main">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/60 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-semibold">
            {activeChat?.title || 'AI Chatbot'}
          </h1>
          
          {!user?.isPremium && (
            <button
              onClick={handleUpgrade}
              className="btn-primary px-3 py-1 text-sm"
            >
              <Crown className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* Chat Window */}
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onUpgradeNeeded={handleUpgradeNeeded}
          user={user}
          availableModels={availableModels}
        />
      </div>

      {/* Modals */}
      <UpgradePopup
        isOpen={upgradePopup.open}
        onClose={() => setUpgradePopup({ open: false })}
        limitType={upgradePopup.limitType}
        limit={upgradePopup.limit}
        current={upgradePopup.current}
      />

      <ProfileModal
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;