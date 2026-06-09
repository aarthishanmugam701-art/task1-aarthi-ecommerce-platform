const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require('../controllers/notificationController');

// Notification routes
router.get('/', protect, getNotifications);
router.get('/unread/count', protect, getUnreadCount);
router.put('/:notificationId/read', protect, markAsRead);
router.put('/all/read', protect, markAllAsRead);
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;
