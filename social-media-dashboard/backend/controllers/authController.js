const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, location, website, profileImage, coverImage } = req.body;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        bio,
        location,
        website,
        profileImage,
        coverImage,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const userId = req.user.id;
    const userToFollow = req.params.userId;

    if (userId === userToFollow) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(userToFollow);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.following.includes(userToFollow)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    user.following.push(userToFollow);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const userToUnfollow = req.params.userId;

    const user = await User.findById(userId);
    const targetUser = await User.findById(userToUnfollow);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.following = user.following.filter((id) => id.toString() !== userToUnfollow);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
