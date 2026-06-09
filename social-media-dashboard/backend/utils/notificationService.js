const { getRedisClient } = require('../config/redis');
const Notification = require('../models/Notification');

class NotificationService {
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // Store in Redis with TTL
      const redisClient = await getRedisClient();
      await redisClient.setEx(
        `notification:${notification._id}`,
        86400, // 24 hours
        JSON.stringify(notification)
      );

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  static async getNotificationFromCache(notificationId) {
    try {
      const redisClient = await getRedisClient();
      const cached = await redisClient.get(`notification:${notificationId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error fetching from cache:', error);
      return null;
    }
  }

  static async clearNotificationCache(notificationId) {
    try {
      const redisClient = await getRedisClient();
      await redisClient.del(`notification:${notificationId}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static async getUserOnlineStatus(userId) {
    try {
      const redisClient = await getRedisClient();
      const status = await redisClient.get(`user:online:${userId}`);
      return status === 'true';
    } catch (error) {
      console.error('Error fetching online status:', error);
      return false;
    }
  }

  static async setUserOnlineStatus(userId, isOnline) {
    try {
      const redisClient = await getRedisClient();
      if (isOnline) {
        await redisClient.setEx(`user:online:${userId}`, 3600, 'true'); // 1 hour
      } else {
        await redisClient.del(`user:online:${userId}`);
      }
    } catch (error) {
      console.error('Error setting online status:', error);
    }
  }

  static async cacheUserMessages(userId, recipientId, messages) {
    try {
      const redisClient = await getRedisClient();
      const key = `messages:${userId}:${recipientId}`;
      await redisClient.setEx(
        key,
        3600, // 1 hour
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Error caching messages:', error);
    }
  }

  static async getUnreadNotificationsCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

module.exports = NotificationService;
