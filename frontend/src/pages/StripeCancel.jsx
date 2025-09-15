import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const StripeCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-6">
          <XCircle className="w-10 h-10 text-yellow-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-white/70 mb-8">
          Your payment was cancelled. You can try upgrading again anytime from your dashboard.
        </p>
        
        <div className="space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StripeCancel;