import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const UpgradePopup = ({ isOpen, onClose, limitType, limit, current }) => {
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await api.post('/stripe/create-session');
      toast.success('Account upgraded to Premium!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Failed to upgrade account');
      setLoading(false);
    }
  };

  const features = [
    'Unlimited chats and messages',
    'Access to all AI models',
    'Export conversations as PDF/Markdown',
    'Priority customer support',
    'Advanced conversation features'
  ];

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
            className="relative card max-w-md w-full border-gradient-cyan glow"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-button rounded-full mb-4">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
              <p className="text-white/70">
                You've reached your {limitType} limit ({current}/{limit}). 
                Upgrade to continue with unlimited access.
              </p>
            </div>

            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-white/60">/month</span>
              </div>
              
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-gradient-green mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Upgrading...' : 'Upgrade Now (Demo)'}
              </button>
              
              <button
                onClick={onClose}
                className="btn-secondary w-full py-3"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-white/50 text-center mt-4">
              Cancel anytime. No hidden fees.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradePopup;