const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserAnalytics, getEngagementStats } = require('../controllers/analyticsController');

// Analytics routes
router.get('/user', protect, getUserAnalytics);
router.get('/engagement', protect, getEngagementStats);

module.exports = router;
