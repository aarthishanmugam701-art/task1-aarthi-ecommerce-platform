const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, attachment } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      attachment,
    });

    await message.save();
    await message.populate('sender', 'username profileImage');
    await message.populate('recipient', 'username profileImage');

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id },
      ],
    })
      .populate('sender', 'username profileImage')
      .populate('recipient', 'username profileImage')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user.id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user.id }, { recipient: req.user.id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.id] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
