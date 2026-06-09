const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    const { content, image, visibility } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Post content is required' });
    }

    const post = new Post({
      author: req.user.id,
      content,
      image,
      visibility: visibility || 'public',
    });

    await post.save();
    await post.populate('author', 'username profileImage');

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const posts = await Post.find({ visibility: 'public' })
      .populate('author', 'username profileImage')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username profileImage')
      .populate('likes', 'username')
      .populate('comments.author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    // Create notification
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        type: 'like',
        actor: req.user.id,
        post: post._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      author: req.user.id,
      text,
    });

    await post.save();
    await post.populate('comments.author', 'username profileImage');

    // Create notification
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        type: 'comment',
        actor: req.user.id,
        post: post._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
