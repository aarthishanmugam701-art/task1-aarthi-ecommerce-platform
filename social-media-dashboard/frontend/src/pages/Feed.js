import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, createPost, likePost, addComment } from '../redux/postsSlice';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.posts);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(getPosts());
    }
  }, [token, navigate, dispatch]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      await dispatch(createPost({ content, visibility: 'public' }));
      setContent('');
    }
  };

  const handleLikePost = (postId) => {
    dispatch(likePost(postId));
  };

  const handleComment = (postId, text) => {
    if (text.trim()) {
      dispatch(addComment({ postId, text }));
    }
  };

  return (
    <div className="feed-container">
      <h2>Social Feed</h2>

      <div className="post-composer">
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      <div className="posts-list">
        {posts && posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <img src={post.author?.profileImage} alt={post.author?.username} />
              <div>
                <h4>{post.author?.username}</h4>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" />}
            </div>

            <div className="post-stats">
              <span>{post.likes?.length || 0} Likes</span>
              <span>{post.comments?.length || 0} Comments</span>
            </div>

            <div className="post-actions">
              <button onClick={() => handleLikePost(post._id)}>
                ❤️ Like
              </button>
              <button>💬 Comment</button>
              <button>↗️ Share</button>
            </div>

            <div className="post-comments">
              {post.comments && post.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <strong>{comment.author?.username}:</strong>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
