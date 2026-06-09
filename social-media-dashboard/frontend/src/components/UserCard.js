import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { useParams } from 'react-router-dom';

const UserCard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/auth/user/${userId}`);
        setUser(response.data.user);
        setIsFollowing(response.data.user.followers?.length > 0);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/auth/follow/${userId}`);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.post(`/auth/unfollow/${userId}`);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!user) {
    return <div className="loading">Loading user...</div>;
  }

  return (
    <div className="user-card">
      <img src={user.profileImage} alt={user.username} className="user-avatar" />
      <h3>{user.firstName} {user.lastName}</h3>
      <p className="username">@{user.username}</p>
      <p className="bio">{user.bio}</p>

      <div className="user-stats">
        <div className="stat">
          <span className="value">{user.followers?.length || 0}</span>
          <span className="label">Followers</span>
        </div>
        <div className="stat">
          <span className="value">{user.following?.length || 0}</span>
          <span className="label">Following</span>
        </div>
      </div>

      <div className="user-actions">
        {isFollowing ? (
          <button onClick={handleUnfollow} className="unfollow-btn">
            Unfollow
          </button>
        ) : (
          <button onClick={handleFollow} className="follow-btn">
            Follow
          </button>
        )}
        <button className="message-btn">Message</button>
      </div>
    </div>
  );
};

export default UserCard;
