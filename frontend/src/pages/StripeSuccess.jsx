import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StripeSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      handleSuccess(sessionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSuccess = async (sessionId) => {
    try {
      await api.get(`/stripe/success?session_id=${sessionId}`);
      await fetchUser(); // Refresh user data
      setSuccess(true);
      toast.success('Welcome to Premium!');
    } catch (error) {
      toast.error('Failed to activate subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gradient-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center"
      >
        {success ? (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-button rounded-full mb-6">
              <Crown className="w-10 h-10 text-black" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Welcome to Premium!</h1>
            <p className="text-white/70 mb-8">
              Your subscription has been activated successfully. You now have unlimited access to all features.
            </p>
            
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gradient-green mr-3" />
                <span>Unlimited chats and messages</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gradient-green mr-3" />
                <span>Access to all AI models</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gradient-green mr-3" />
                <span>Export conversations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gradient-green mr-3" />
                <span>Priority support</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full py-3"
            >
              Start Chatting
            </button>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
              <span className="text-red-400 text-4xl">✕</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
            <p className="text-white/70 mb-8">
              There was an issue processing your payment. Please try again.
            </p>
            
            <div className="space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary px-6 py-3"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-6 py-3"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default StripeSuccess;