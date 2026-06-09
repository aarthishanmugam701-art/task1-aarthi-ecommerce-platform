import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './redux/authSlice';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import './styles/App.css';

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>📱 Social Dashboard</h1>
          </div>
          <div className="nav-links">
            {user && (
              <>
                <a href="/home">Home</a>
                <a href="/messages">Messages</a>
                <a href="/analytics">Analytics</a>
                <a href={`/profile/${user.id}`}>Profile</a>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={token ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/messages" element={token ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/messages/:userId" element={token ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={token ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? '/home' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
