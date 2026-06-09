import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import messagesReducer from './messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    messages: messagesReducer,
  },
});

export default store;
