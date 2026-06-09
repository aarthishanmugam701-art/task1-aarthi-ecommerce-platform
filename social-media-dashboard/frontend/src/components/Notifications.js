import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../utils/socket';
import axiosInstance from '../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        setNotifications(response.data.notifications);
        
        const unreadRes = await axiosInstance.get('/notifications/unread/count');
        setUnreadCount(unreadRes.data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Listen for real-time notifications
    const socket = getSocket();
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-widget">
      <button
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications yet</p>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className="notification-content">
                    <p>
                      <strong>{notification.actor?.username}</strong> {notification.message}
                    </p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification._id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
