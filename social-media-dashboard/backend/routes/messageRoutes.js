const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  getConversations,
  deleteMessage,
} = require('../controllers/messageController');

// Message routes
router.post('/send', protect, sendMessage);
router.get('/conversation/:userId', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;
