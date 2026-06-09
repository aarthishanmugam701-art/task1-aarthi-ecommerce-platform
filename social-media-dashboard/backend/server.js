require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const { getRedisClient } = require('./config/redis');
const Notification = require('./models/Notification');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Socket.IO event handling
const userSockets = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Store user socket mapping
  socket.on('user-connected', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Real-time messaging
  socket.on('send-message', async (data) => {
    const { sender, recipient, content } = data;
    console.log(`Message from ${sender} to ${recipient}: ${content}`);

    // Emit message to recipient if online
    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('receive-message', {
        sender,
        content,
        timestamp: new Date(),
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { recipient, sender } = data;
    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('typing-indicator', {
        sender,
      });
    }
  });

  // Stop typing
  socket.on('stop-typing', (data) => {
    const { recipient, sender } = data;
    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('stop-typing', {
        sender,
      });
    }
  });

  // Notification events
  socket.on('like-post', (data) => {
    const { postAuthor, liker, postId } = data;
    if (userSockets[postAuthor] && postAuthor !== liker) {
      io.to(userSockets[postAuthor]).emit('post-liked', {
        liker,
        postId,
        timestamp: new Date(),
      });
    }
  });

  socket.on('follow-user', (data) => {
    const { follower, followee } = data;
    if (userSockets[followee]) {
      io.to(userSockets[followee]).emit('user-followed', {
        follower,
        timestamp: new Date(),
      });
    }
  });

  socket.on('comment-post', (data) => {
    const { postAuthor, commenter, postId, text } = data;
    if (userSockets[postAuthor] && postAuthor !== commenter) {
      io.to(userSockets[postAuthor]).emit('post-commented', {
        commenter,
        postId,
        text,
        timestamp: new Date(),
      });
    }
  });

  // User online status
  socket.on('user-online', (userId) => {
    io.emit('user-online', { userId, status: 'online' });
  });

  socket.on('user-offline', (userId) => {
    delete userSockets[userId];
    io.emit('user-offline', { userId, status: 'offline' });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [userId, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[userId];
        io.emit('user-offline', { userId, status: 'offline' });
        break;
      }
    }
  });
});

// Notification handler with Redis
const notificationHandler = async () => {
  try {
    const redisClient = await getRedisClient();

    setInterval(async () => {
      const notifications = await Notification.find({ isRead: false })
        .populate('actor', 'username profileImage')
        .populate('post', 'content image');

      for (const notification of notifications) {
        const recipientSocketId = userSockets[notification.recipient];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('notification', {
            id: notification._id,
            type: notification.type,
            actor: notification.actor,
            message: notification.message,
            timestamp: notification.createdAt,
          });

          // Store notification in Redis with TTL (24 hours)
          await redisClient.setEx(
            `notification:${notification._id}`,
            86400,
            JSON.stringify(notification)
          );
        }
      }
    }, 5000);
  } catch (error) {
    console.error('Notification handler error:', error);
  }
};

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start notification handler
notificationHandler();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
