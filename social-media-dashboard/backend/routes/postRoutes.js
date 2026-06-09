const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getUserPosts,
  likePost,
  unlikePost,
  addComment,
  deletePost,
} = require('../controllers/postController');

// Post routes
router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/unlike', protect, unlikePost);
router.post('/:postId/comment', protect, addComment);
router.delete('/:postId', protect, deletePost);

module.exports = router;
