# Social Media Dashboard - API Documentation

## Authentication Endpoints

### Register
- **URL**: `/api/auth/register`
- **Method**: POST
- **Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login
- **URL**: `/api/auth/login`
- **Method**: POST
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Get Profile
- **URL**: `/api/auth/profile`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`

### Update Profile
- **URL**: `/api/auth/profile`
- **Method**: PUT
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Developer",
  "location": "San Francisco",
  "website": "https://example.com"
}
```

## Post Endpoints

### Create Post
- **URL**: `/api/posts`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "content": "Hello everyone!",
  "image": "image_url",
  "visibility": "public"
}
```

### Get All Posts
- **URL**: `/api/posts?page=1&limit=10`
- **Method**: GET

### Like Post
- **URL**: `/api/posts/{postId}/like`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`

### Add Comment
- **URL**: `/api/posts/{postId}/comment`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "text": "Great post!"
}
```

## Message Endpoints

### Send Message
- **URL**: `/api/messages/send`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "recipientId": "recipient_user_id",
  "content": "Hello there!",
  "attachment": "optional_file_url"
}
```

### Get Conversation
- **URL**: `/api/messages/conversation/{userId}`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`

### Get All Conversations
- **URL**: `/api/messages/conversations`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`

## Analytics Endpoints

### Get User Analytics
- **URL**: `/api/analytics/user`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`

### Get Engagement Stats
- **URL**: `/api/analytics/engagement`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`

## Follow Endpoints

### Follow User
- **URL**: `/api/auth/follow/{userId}`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`

### Unfollow User
- **URL**: `/api/auth/unfollow/{userId}`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

Recommended rate limits:
- Authentication endpoints: 5 requests per 15 minutes per IP
- General API endpoints: 100 requests per 15 minutes per user
- WebSocket: 50 messages per minute per user

## Pagination

For paginated endpoints, use query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes:
```json
{
  "success": true,
  "posts": [...],
  "totalPages": 5,
  "currentPage": 1
}
```
