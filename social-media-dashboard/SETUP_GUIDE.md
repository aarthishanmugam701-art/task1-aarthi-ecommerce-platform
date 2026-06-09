# Social Media Dashboard - Setup Guide

## Prerequisites

- Node.js v14+ and npm v6+
- MongoDB 4.4+ (local or MongoDB Atlas)
- Redis 6+ (local or cloud instance)
- Git

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/social-media-dashboard.git
cd social-media-dashboard
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-db
JWT_SECRET=your_super_secret_key_minimum_32_characters
REDIS_URL=redis://localhost:6379
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**MongoDB Atlas Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address
6. Copy the connection string to `MONGODB_URI`

**Redis Setup (Local):**
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
redis-server

# Windows
# Use WSL or Docker
```

**Redis Setup (Cloud):**
Use services like:
- Redis Cloud (free tier available)
- AWS ElastiCache
- Heroku Redis

#### 2.4 Verify Backend Setup
```bash
npm run dev
```
You should see: `Server running on port 5000`

### 3. Frontend Setup

#### 3.1 Open New Terminal & Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

#### 3.4 Start Frontend Development Server
```bash
npm start
```
The application will automatically open at `http://localhost:3000`

## Docker Setup (Alternative)

### Prerequisites
- Docker
- Docker Compose

### Quick Start with Docker
```bash
docker-compose up -d
```

This will:
- Start MongoDB on port 27017
- Start Redis on port 6379
- Start Backend on port 5000
- Start Frontend on port 3000

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017
- Redis: localhost:6379

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Testing the Application

### 1. Create Test Account
1. Go to http://localhost:3000
2. Click "Register here"
3. Fill in the form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - First Name: Test
   - Last Name: User

### 2. Test Features
- ✅ Create a post
- ✅ Like/unlike posts
- ✅ Add comments
- ✅ Follow/unfollow users
- ✅ Send messages
- ✅ View analytics

## Troubleshooting

### MongoDB Connection Error
```
Error: getaddrinfo ENOTFOUND cluster.mongodb.net
```
**Solution:** 
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas network access settings
- Whitelist your IP address

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:**
- Start Redis service
- Or update `REDIS_URL` to your cloud Redis instance

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Clear browser cache and try again

### Port Already in Use
```bash
# Check process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev  # With auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # With hot reload
```

### Making API Changes
1. Update model in `backend/models/`
2. Update controller in `backend/controllers/`
3. Update route in `backend/routes/`
4. Test with frontend or Postman

### Making UI Changes
1. Update component in `frontend/src/`
2. Changes auto-reload in browser

## Database Migration

### Create MongoDB Indexes
```bash
# Connect to MongoDB
mongo "mongodb+srv://username:password@cluster.mongodb.net/social-media-db"

# Create indexes
db.users.createIndex({ "username": 1 })
db.users.createIndex({ "email": 1 })
db.posts.createIndex({ "author": 1 })
db.posts.createIndex({ "createdAt": -1 })
```

### Seed Test Data
```bash
# Create a seed script in backend/utils/seed.js
npm run seed
```

## Deployment

### Deploying Backend to Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Deploying Frontend to Vercel/Netlify
```bash
npm run build
# Upload build folder to Vercel or Netlify
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production for production
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up Redis persistence
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist
- [ ] Set up error monitoring (Sentry)
- [ ] Regular security audits

## Performance Optimization

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Caching**: Use Redis for session data
3. **Pagination**: Implement for large datasets
4. **Image Optimization**: Compress images before upload
5. **Lazy Loading**: Implement for components
6. **Code Splitting**: Use dynamic imports
7. **Bundle Analysis**: Use webpack-bundle-analyzer

## Monitoring & Logging

### Enable Logging in Backend
```bash
npm install winston
```

### Monitor Application
- Use tools like New Relic, DataDog, or Sentry
- Set up alerts for critical errors
- Monitor database performance

## Getting Help

- Check [Documentation](./README.md)
- Read [API Documentation](./API_DOCUMENTATION.md)
- Review [Development Guide](./DEVELOPMENT.md)
- Open an issue on GitHub

## Next Steps

1. Customize the styling (update CSS files)
2. Add more features (notifications, search, etc.)
3. Deploy to production
4. Set up CI/CD pipeline
5. Configure monitoring and logging

---

**Happy Coding!** 🚀
