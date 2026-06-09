const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, getProfile, updateProfile, getUser, follow, unfollow } = require('../controllers/authController');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/user/:userId', protect, getUser);
router.post('/follow/:userId', protect, follow);
router.post('/unfollow/:userId', protect, unfollow);

module.exports = router;
