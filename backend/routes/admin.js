const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getUserStats,
  getChatStats,
  getModelStats,
  getRevenue,
  getUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

router.use(authMiddleware, adminMiddleware);

router.get('/users/stats', getUserStats);
router.get('/chats/stats', getChatStats);
router.get('/models/stats', getModelStats);
router.get('/revenue', getRevenue);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

module.exports = router;