import React, { useState, useRef } from 'react';

const PostComposer = ({ onSubmit, loading }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({
        content,
        image,
        visibility,
      });
      setContent('');
      setImage(null);
    }
  };

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        rows={4}
      />

      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="remove-image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="composer-footer">
        <div className="actions">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="icon-btn"
            title="Add image"
          >
            🖼️
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="visibility-select"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button type="submit" disabled={loading || !content.trim()} className="post-btn">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default PostComposer;
