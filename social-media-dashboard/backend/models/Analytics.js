const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalFollowers: {
      type: Number,
      default: 0,
    },
    totalFollowing: {
      type: Number,
      default: 0,
    },
    engagementRate: Number,
    dailyStats: [
      {
        date: Date,
        postsCreated: Number,
        likesReceived: Number,
        commentsReceived: Number,
        followersGained: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
