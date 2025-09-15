const { Chat, Message } = require('../models');

const checkChatLimit = async (req, res, next) => {
  try {
    if (req.user.isPremium()) {
      return next();
    }

    const chatCount = await Chat.countDocuments({ userId: req.user._id });
    
    if (chatCount >= 20) {
      return res.status(403).json({ 
        error: 'Free plan limit reached. Upgrade to Premium.',
        limitType: 'chats',
        limit: 20,
        current: chatCount
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking chat limit' });
  }
};

const checkMessageLimit = async (req, res, next) => {
  try {
    if (req.user.isPremium()) {
      return next();
    }

    const messageCount = await Message.countDocuments({ 
      chatId: req.params.id || req.params.chatId 
    });
    
    if (messageCount >= 20) {
      return res.status(403).json({ 
        error: 'Free plan limit reached. Upgrade to Premium.',
        limitType: 'messages',
        limit: 20,
        current: messageCount
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking message limit' });
  }
};

module.exports = { checkChatLimit, checkMessageLimit };