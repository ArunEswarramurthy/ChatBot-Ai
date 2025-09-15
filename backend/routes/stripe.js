const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createCheckoutSession,
  handleSuccess,
  handleCancel,
  webhook
} = require('../controllers/stripeController');

router.post('/create-session', authMiddleware, createCheckoutSession);
router.get('/success', authMiddleware, handleSuccess);
router.get('/cancel', handleCancel);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

module.exports = router;