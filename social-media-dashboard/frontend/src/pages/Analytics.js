import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analyticsRes = await axiosInstance.get('/analytics/user');
        const statsRes = await axiosInstance.get('/analytics/engagement');
        setAnalytics(analyticsRes.data.analytics);
        setStats(statsRes.data.stats);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-container">
      <h2>Your Analytics Dashboard</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Posts</h3>
          <p className="stat-value">{stats?.totalPosts || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Likes</h3>
          <p className="stat-value">{stats?.totalLikes || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Comments</h3>
          <p className="stat-value">{stats?.totalComments || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Followers</h3>
          <p className="stat-value">{stats?.totalFollowers || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Avg Likes/Post</h3>
          <p className="stat-value">{stats?.averageLikesPerPost?.toFixed(2) || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Avg Comments/Post</h3>
          <p className="stat-value">{stats?.averageCommentsPerPost?.toFixed(2) || 0}</p>
        </div>
      </div>

      {analytics && (
        <div className="engagement-details">
          <h3>Engagement Rate</h3>
          <p>{analytics.engagementRate?.toFixed(2) || 0}%</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
