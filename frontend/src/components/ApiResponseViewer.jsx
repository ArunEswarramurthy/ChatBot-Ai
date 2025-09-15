import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Code, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ApiResponseViewer = ({ isOpen, onClose, response, endpoint }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('formatted');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResponse = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return data;
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
            className="relative card max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">API Response</h2>
                <p className="text-white/60 text-sm">{endpoint}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('formatted')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-all ${
                      viewMode === 'formatted'
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Formatted</span>
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-all ${
                      viewMode === 'raw'
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>Raw</span>
                  </button>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
              {viewMode === 'formatted' ? (
                <div className="space-y-4">
                  {response && typeof response === 'object' ? (
                    Object.entries(response).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gradient-cyan font-semibold">{key}</span>
                          <span className="text-xs text-white/50">
                            {Array.isArray(value) ? 'Array' : typeof value}
                          </span>
                        </div>
                        <div className="text-white/80">
                          {typeof value === 'object' ? (
                            <pre className="text-sm overflow-x-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            <span>{String(value)}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 rounded-lg p-4">
                      <pre className="text-white/80 text-sm overflow-x-auto">
                        {formatResponse(response)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-white/80 text-sm overflow-x-auto font-mono">
                    {formatResponse(response)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="text-xs text-white/50">
                Response size: {JSON.stringify(response).length} characters
              </div>
              <button
                onClick={onClose}
                className="btn-secondary px-4 py-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApiResponseViewer;