# Social Media Dashboard - Development Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB and Redis credentials
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

## Database Schema

### Users Collection
- Stores user profiles, follow relationships, and online status
- Indexes: username, email (unique)

### Posts Collection
- Stores user posts with content, images, and engagement metrics
- Embedded comments array with author references
- Indexes: author, createdAt, visibility

### Messages Collection
- Stores private messages between users
- Tracks read status
- Indexes: sender, recipient, createdAt

### Notifications Collection
- Stores user notifications (likes, comments, follows, messages)
- Tracks read status
- Indexes: recipient, isRead, createdAt

### Analytics Collection
- Stores aggregated user statistics
- Daily engagement metrics
- Indexes: user

## Redis Keys Structure

```
notification:{id} - Cached notification data (TTL: 24 hours)
user:online:{id} - User online status
messages:conversation:{userId1}:{userId2} - Conversation cache
```

## Common Issues and Solutions

### MongoDB Connection Error
- Verify MongoDB URI in .env
- Check database credentials
- Ensure network access is allowed in MongoDB Atlas

### Redis Connection Error
- Check if Redis server is running locally or verify cloud URL
- Verify Redis credentials if using cloud service

### CORS Errors
- Update CORS_ORIGIN in backend .env
- Ensure frontend and backend URLs match

### WebSocket Connection Issues
- Check if Socket.IO server is running
- Verify SOCKET_URL in frontend .env
- Check firewall settings

## Performance Tips

1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Caching**: Use Redis to cache frequently accessed data
3. **Indexing**: Add proper database indexes for common queries
4. **Compression**: Enable gzip compression in Express
5. **Image Optimization**: Optimize images before upload

## Deployment Checklist

- [ ] Set NODE_ENV to production
- [ ] Use environment-specific configurations
- [ ] Enable HTTPS
- [ ] Set up SSL certificates
- [ ] Configure production database backups
- [ ] Set up Redis persistence
- [ ] Enable rate limiting
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (Sentry)
- [ ] Test all features in staging
- [ ] Set up CI/CD pipeline

## Testing

### Backend
```bash
npm test
```

### Frontend
```bash
npm test
```

## Useful Commands

### Backend
```bash
npm start          # Run production server
npm run dev        # Run development server with nodemon
npm test           # Run tests
npm run lint       # Run linter
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from create-react-app (not recommended)
```

## Architecture Decision Records (ADRs)

### Why MongoDB?
- Flexible schema for evolving application requirements
- Good performance for document-based data
- Easy horizontal scaling with sharding
- Good integration with Node.js via Mongoose

### Why Socket.IO?
- Real-time bidirectional communication
- Automatic fallback mechanisms
- Built-in room and namespace support
- Active maintenance and community

### Why Redux?
- Predictable state management
- Time-travel debugging capabilities
- Large ecosystem and middleware support
- Works well with Redux Toolkit for reduced boilerplate

## Security Considerations

1. **Authentication**: JWT tokens with reasonable expiration
2. **Authorization**: Role-based access control (to be implemented)
3. **Data Validation**: Input validation on all endpoints
4. **Password Security**: Bcrypt hashing with salt rounds
5. **Rate Limiting**: Implement to prevent abuse
6. **HTTPS**: Always use in production
7. **Database**: Regular backups and access controls
8. **Environment Variables**: Never commit sensitive data

## Monitoring and Logging

- Implement centralized logging (Winston, Bunyan)
- Use error tracking (Sentry, Rollbar)
- Monitor application performance (New Relic, DataDog)
- Set up alerts for critical errors
