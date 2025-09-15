const { Chat, Message } = require('../models');

const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    
    const chat = await Chat.create({
      userId: req.user._id,
      title: title || 'New Chat'
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating chat' });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    // Get latest message for each chat
    for (let chat of chats) {
      const latestMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .lean();
      chat.Messages = latestMessage ? [latestMessage] : [];
    }

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching chats' });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: 1 })
      .lean();

    chat.Messages = messages;
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching chat' });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    await Message.deleteMany({ chatId: chat._id });
    await Chat.findByIdAndDelete(chat._id);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting chat' });
  }
};

const exportChat = async (req, res) => {
  try {
    const { format = 'text' } = req.query;
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: 1 })
      .lean();
    chat.Messages = messages;

    const cleanTitle = chat.title.replace(/[^a-zA-Z0-9]/g, '-');

    if (format === 'pdf') {
      // Simple PDF-like text format for now
      let content = `${chat.title}\n${'='.repeat(chat.title.length)}\n\n`;
      content += `Exported on: ${new Date().toLocaleString()}\n\n`;
      
      chat.Messages.forEach(message => {
        const timestamp = new Date(message.createdAt).toLocaleString();
        const sender = message.sender === 'user' ? 'You' : `AI (${message.model || 'Unknown'})`;
        content += `${sender} - ${timestamp}\n${message.text}\n\n${'─'.repeat(50)}\n\n`;
      });
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="chat-${cleanTitle}.txt"`);
      res.send(content);
      
    } else if (format === 'markdown') {
      let content = `# ${chat.title}\n\n`;
      content += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;
      
      chat.Messages.forEach(message => {
        const timestamp = new Date(message.createdAt).toLocaleString();
        const sender = message.sender === 'user' ? '👤 You' : `🤖 AI (${message.model || 'Unknown'})`;
        content += `**${sender}** - *${timestamp}*\n\n${message.text}\n\n---\n\n`;
      });
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="chat-${cleanTitle}.md"`);
      res.send(content);
      
    } else {
      // Plain text format
      let content = `${chat.title}\n${'='.repeat(chat.title.length)}\n\n`;
      content += `Exported on: ${new Date().toLocaleString()}\n\n`;
      
      chat.Messages.forEach(message => {
        const timestamp = new Date(message.createdAt).toLocaleString();
        const sender = message.sender === 'user' ? 'You' : `AI (${message.model || 'Unknown'})`;
        content += `${sender} - ${timestamp}\n${message.text}\n\n${'─'.repeat(50)}\n\n`;
      });
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="chat-${cleanTitle}.txt"`);
      res.send(content);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error exporting chat' });
  }
};

module.exports = {
  createChat,
  getChats,
  getChat,
  deleteChat,
  exportChat
};