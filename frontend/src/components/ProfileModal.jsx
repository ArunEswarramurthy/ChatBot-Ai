import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const { updateProfile, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = { name: formData.name };
    
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    const result = await updateProfile(updateData);
    
    if (result.success) {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setLoading(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    const result = await deleteAccount(deletePassword);
    
    if (result.success) {
      onClose();
    }
    
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative card max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
              
              <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'profile'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'danger'
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Danger Zone
                </button>
              </div>
            </div>

            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="input-field pl-10 w-full bg-white/5 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  
                  {user?.provider === 'local' && (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="input-field pl-10 w-full"
                              placeholder="Enter current password"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="input-field pl-10 w-full"
                              placeholder="Enter new password"
                              minLength={6}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="input-field pl-10 w-full"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {user?.provider === 'google' && (
                    <p className="text-white/60 text-sm">
                      You signed in with Google. Password changes are managed through your Google account.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                    All your chats and data will be permanently deleted.
                  </p>
                  
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    {user?.provider === 'local' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Enter your password to confirm
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="input-field pl-10 w-full"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading || (user?.provider === 'local' && !deletePassword)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;