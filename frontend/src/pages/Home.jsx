import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, Shield, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI-Powered Conversations",
      description: "Chat with multiple AI models including GPT, Gemini, and more"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized AI infrastructure"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your conversations are encrypted and never shared"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Features",
      description: "Unlimited chats, export options, and priority support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gradient"
          >
            AI Chatbot SaaS
          </motion.div>
          <div className="space-x-4">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Chat with AI
            <span className="text-gradient block">Like Never Before</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Experience the future of AI conversations with multiple models, 
            unlimited possibilities, and premium features designed for power users.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-x-4"
          >
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose Our Platform?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-gradient-cyan mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Simple Pricing
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-white/60">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  20 chats per account
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  30 messages per chat
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  Basic AI models
                </li>
              </ul>
              <Link to="/signup" className="btn-secondary w-full text-center block">
                Get Started
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card border-gradient-cyan glow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Premium Plan</h3>
                <span className="bg-gradient-button text-black px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <div className="text-4xl font-bold mb-6">$9.99<span className="text-lg text-white/60">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  Unlimited chats
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  Unlimited messages
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  All AI models
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  Export conversations
                </li>
                <li className="flex items-center">
                  <span className="text-gradient-green mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link to="/signup" className="btn-primary w-full text-center block">
                Upgrade Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-gradient mb-4">AI Chatbot SaaS</div>
          <p className="text-white/60">
            © 2024 AI Chatbot SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;