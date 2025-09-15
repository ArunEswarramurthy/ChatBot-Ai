const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkChatLimit, checkMessageLimit } = require('../middleware/premiumMiddleware');
const {
  createChat,
  getChats,
  getChat,
  deleteChat,
  exportChat
} = require('../controllers/chatController');
const { getAvailableModels, sendMessage } = require('../controllers/aiController');

router.post('/', authMiddleware, checkChatLimit, createChat);
router.get('/', authMiddleware, getChats);
router.get('/models', authMiddleware, getAvailableModels);
router.get('/:id', authMiddleware, getChat);
router.delete('/:id', authMiddleware, deleteChat);
router.get('/:id/export', authMiddleware, exportChat);
router.post('/:id/messages', authMiddleware, checkMessageLimit, sendMessage);

module.exports = router;