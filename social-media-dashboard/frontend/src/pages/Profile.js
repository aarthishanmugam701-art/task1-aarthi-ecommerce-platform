import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/auth/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.coverImage && <img src={user.coverImage} alt="Cover" className="cover-image" />}
      </div>

      <div className="profile-info">
        <img src={user.profileImage} alt={user.username} className="profile-image" />
        <h2>{user.firstName} {user.lastName}</h2>
        <p className="username">@{user.username}</p>
        {user.bio && <p className="bio">{user.bio}</p>}

        <div className="profile-stats">
          <div className="stat">
            <strong>{user.followers?.length || 0}</strong>
            <span>Followers</span>
          </div>
          <div className="stat">
            <strong>{user.following?.length || 0}</strong>
            <span>Following</span>
          </div>
        </div>

        {user.website && (
          <a href={user.website} target="_blank" rel="noopener noreferrer">
            🔗 {user.website}
          </a>
        )}

        <div className="profile-actions">
          <button>Follow</button>
          <button>Message</button>
        </div>
      </div>

      <div className="user-posts">
        <h3>Posts</h3>
        {/* Posts will be displayed here */}
      </div>
    </div>
  );
};

export default Profile;
