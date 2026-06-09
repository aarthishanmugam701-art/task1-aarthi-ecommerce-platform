const Analytics = require('../models/Analytics');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getUserAnalytics = async (req, res) => {
  try {
    let analytics = await Analytics.findOne({ user: req.user.id });

    if (!analytics) {
      analytics = new Analytics({ user: req.user.id });
      await analytics.save();
    }

    const user = await User.findById(req.user.id);
    const posts = await Post.find({ author: req.user.id });

    let totalLikes = 0;
    let totalComments = 0;

    posts.forEach((post) => {
      totalLikes += post.likes.length;
      totalComments += post.comments.length;
    });

    analytics.totalPosts = posts.length;
    analytics.totalLikes = totalLikes;
    analytics.totalComments = totalComments;
    analytics.totalFollowers = user.followers.length;
    analytics.totalFollowing = user.following.length;
    analytics.engagementRate =
      user.followers.length > 0 ? ((totalLikes + totalComments) / (user.followers.length * posts.length)) * 100 : 0;

    await analytics.save();

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEngagementStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({ author: req.user.id });

    const stats = {
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0),
      totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
      totalFollowers: user.followers.length,
      totalFollowing: user.following.length,
      averageLikesPerPost: posts.length > 0 ? posts.reduce((sum, post) => sum + post.likes.length, 0) / posts.length : 0,
      averageCommentsPerPost: posts.length > 0 ? posts.reduce((sum, post) => sum + post.comments.length, 0) / posts.length : 0,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
