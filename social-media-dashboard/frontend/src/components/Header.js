import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>📱 Social Dashboard</h1>
        </div>

        <nav className="nav-menu">
          <a href="/home">🏠 Home</a>
          <a href="/messages">💬 Messages</a>
          <a href="/analytics">📊 Analytics</a>
        </nav>

        <div className="user-menu">
          {user && (
            <>
              <a href={`/profile/${user.id}`} className="profile-link">
                👤 {user.username}
              </a>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
