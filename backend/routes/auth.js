const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  googleAuth,
  googleCallback
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/account', authMiddleware, deleteAccount);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;