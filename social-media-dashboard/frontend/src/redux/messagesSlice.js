import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/api';

export const getMessages = createAsyncThunk('messages/getMessages', async (userId) => {
  const response = await axiosInstance.get(`/messages/conversation/${userId}`);
  return response.data;
});

export const getConversations = createAsyncThunk('messages/getConversations', async () => {
  const response = await axiosInstance.get('/messages/conversations');
  return response.data;
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async (messageData) => {
  const response = await axiosInstance.post('/messages/send', messageData);
  return response.data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    conversations: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.message);
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
