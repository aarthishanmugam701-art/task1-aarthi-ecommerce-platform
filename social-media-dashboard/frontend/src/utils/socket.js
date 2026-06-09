import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        userId,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('user-connected', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
