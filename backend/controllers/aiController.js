const axios = require('axios');
const { Message, Chat } = require('../models');

const AI_MODELS = {
  'gemini-1.5-flash': {
    provider: 'google',
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
  },

  'deepseek-chat': {
    provider: 'openrouter',
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'deepseek/deepseek-chat'
  },
  'gemini-3-27b': {
    provider: 'openrouter',
    apiKey: process.env.GEMINI_3_27B_API_KEY,
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'google/gemini-flash-1.5'
  },
  'gemini-2.5-pro': {
    provider: 'openrouter',
    apiKey: process.env.GEMINI_2_5_PRO_API_KEY,
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'google/gemini-pro-1.5'
  },
  'llama3-70b-8192': {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY,
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-70b-8192'
  },
};

const callAI = async (model, messages, userMessage) => {
  const aiModel = AI_MODELS[model];
  if (!aiModel) {
    throw new Error('Invalid AI model selected');
  }

  try {
    if (aiModel.provider === 'google') {
      const response = await axios.post(
        `${aiModel.endpoint}?key=${aiModel.apiKey}`,
        {
          contents: [{
            parts: [{ text: userMessage }]
          }]
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } else {
      // OpenAI-compatible APIs (Groq, OpenRouter)
      const chatMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      chatMessages.push({ role: 'user', content: userMessage });

      const response = await axios.post(
        aiModel.endpoint,
        {
          model: aiModel.model,
          messages: chatMessages,
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${aiModel.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    }
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response');
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, model = 'gemini-1.5-flash' } = req.body;
    const chatId = req.params.id;

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Save user message
    const userMessage = await Message.create({
      chatId,
      sender: 'user',
      text,
      model: null
    });

    // Get chat history for context
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    // Get AI response
    const aiResponse = await callAI(model, messages, text);

    // Save AI message
    const aiMessage = await Message.create({
      chatId,
      sender: 'ai',
      text: aiResponse,
      model
    });

    // Update chat title if it's the first user message
    const userMessages = messages.filter(msg => msg.sender === 'user');
    if (userMessages.length === 1) {
      const title = text.length > 50 ? text.substring(0, 50) + '...' : text;
      await Chat.findByIdAndUpdate(chat._id, { title });
    }

    res.json({
      userMessage,
      aiMessage,
      chat: await Chat.findById(chatId)
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message || 'Server error sending message' });
  }
};

const getAvailableModels = (req, res) => {
  const models = Object.keys(AI_MODELS).map(key => ({
    id: key,
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    provider: AI_MODELS[key].provider
  }));
  
  res.json(models);
};

module.exports = {
  sendMessage,
  getAvailableModels
};
