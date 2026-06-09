# Social Media Dashboard

A full-stack social media platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time messaging, featuring user profiles, media uploads, social interactions (likes, comments, follows), and analytics dashboard with Redis-powered notifications.

## Features

### User Management
- User registration and authentication with JWT
- User profiles with profile images and cover photos
- Follow/unfollow functionality
- User online status tracking

### Social Features
- Create, read, and delete posts
- Like and unlike posts
- Add comments to posts
- Media uploads for posts
- Public/private/friends-only post visibility
- Engagement metrics and statistics

### Real-time Messaging
- Real-time messaging with WebSockets (Socket.IO)
- Conversation management
- Message history
- Typing indicators
- Unread message tracking

### Notifications
- Redis-powered notification system
- Real-time notification delivery
- Notification types: likes, comments, follows, messages
- Notification persistence

### Analytics
- User engagement analytics
- Total posts, likes, and comments statistics
- Follower/following counts
- Engagement rate calculation
- Average engagement metrics

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.IO** - Real-time communication
- **Redis** - Caching and notifications
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Redux/Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket client
- **CSS3** - Styling

## Project Structure

```
social-media-dashboard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Analytics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── messageController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── messageRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── database.js
│   │   └── redis.js
│   ├── utils/
│   │   └── tokenUtils.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Feed.js
│   │   │   ├── Messages.js
│   │   │   ├── Profile.js
│   │   │   └── Analytics.js
│   │   ├── redux/
│   │   │   ├── authSlice.js
│   │   │   ├── postsSlice.js
│   │   │   ├── messagesSlice.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-db
JWT_SECRET=your_jwt_secret_key_here
REDIS_URL=redis://localhost:6379
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/user/:userId` - Get user by ID
- `POST /api/auth/follow/:userId` - Follow a user
- `POST /api/auth/unfollow/:userId` - Unfollow a user

### Posts
- `GET /api/posts` - Get all public posts (paginated)
- `POST /api/posts` - Create a new post
- `GET /api/posts/user/:userId` - Get posts by a specific user
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `POST /api/posts/:postId/comment` - Add a comment
- `DELETE /api/posts/:postId` - Delete a post

### Messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversation/:userId` - Get conversation with a user
- `GET /api/messages/conversations` - Get all conversations
- `DELETE /api/messages/:messageId` - Delete a message

### Analytics
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/engagement` - Get engagement statistics

## WebSocket Events

### Client to Server
- `user-connected` - Notify server of user connection
- `send-message` - Send a real-time message
- `typing` - Notify typing status
- `stop-typing` - Stop typing indicator
- `like-post` - Notify post like
- `follow-user` - Notify user follow
- `comment-post` - Notify post comment

### Server to Client
- `receive-message` - Receive a real-time message
- `typing-indicator` - Receive typing indicator
- `stop-typing` - Stop typing indicator
- `post-liked` - Notification of post like
- `user-followed` - Notification of user follow
- `post-commented` - Notification of post comment
- `notification` - General notification
- `user-online` - User online status
- `user-offline` - User offline status

## Advanced Features

### Redis Integration
- Notification caching with TTL
- Real-time notification delivery
- Message history caching
- Session management

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet for HTTP headers
- Input validation with express-validator

## Future Enhancements

- [ ] Image optimization and CDN integration
- [ ] Advanced search functionality
- [ ] User recommendations engine
- [ ] Video uploads and streaming
- [ ] Hashtag and mention support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Rate limiting and spam detection
- [ ] Two-factor authentication

## Contributing

Contributions are welcome! Please follow the existing code style and create pull requests for any improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@socialmedia-dashboard.com or create an issue in the repository.

## Author

Created with ❤️ by the Social Media Dashboard Team

---

**Note**: This is a demonstration project. Ensure proper security measures and compliance with data protection regulations before deploying to production.
