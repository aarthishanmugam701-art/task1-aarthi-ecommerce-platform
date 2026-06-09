import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/api';

export const getPosts = createAsyncThunk('posts/getPosts', async (params) => {
  const response = await axiosInstance.get('/posts', { params });
  return response.data;
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
  const response = await axiosInstance.post('/posts', postData);
  return response.data;
});

export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/like`);
  return response.data;
});

export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/unlike`);
  return response.data;
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, text }) => {
  const response = await axiosInstance.post(`/posts/${postId}/comment`, { text });
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.post._id);
        if (post) {
          post.likes = action.payload.post.likes;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.post._id);
        if (post) {
          post.likes = action.payload.post.likes;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.post._id);
        if (post) {
          post.comments = action.payload.post.comments;
        }
      });
  },
});

export default postsSlice.reducer;
