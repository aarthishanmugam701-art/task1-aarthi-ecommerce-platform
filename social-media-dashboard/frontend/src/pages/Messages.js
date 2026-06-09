import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, getConversations, sendMessage, addMessage } from '../redux/messagesSlice';
import { getSocket, connectSocket } from '../utils/socket';
import { useParams, useNavigate } from 'react-router-dom';

const Messages = () => {
  const { userId } = useParams();
  const [messageText, setMessageText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, conversations } = useSelector((state) => state.messages);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(getConversations());
      if (user) {
        connectSocket(user.id);
      }
    }
  }, [token, navigate, user, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getMessages(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on('receive-message', (data) => {
        dispatch(addMessage(data));
      });

      return () => {
        socket.off('receive-message');
      };
    }
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && userId) {
      const messageData = {
        recipientId: userId,
        content: messageText,
      };

      dispatch(sendMessage(messageData));
      setMessageText('');

      // Emit via socket
      const socket = getSocket();
      if (socket) {
        socket.emit('send-message', {
          sender: user.id,
          recipient: userId,
          content: messageText,
        });
      }
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h3>Conversations</h3>
        {conversations && conversations.map((conv) => (
          <div
            key={conv._id}
            className={`conversation-item ${conv._id === userId ? 'active' : ''}`}
            onClick={() => navigate(`/messages/${conv._id}`)}
          >
            <img src={conv.user?.[0]?.profileImage} alt={conv.user?.[0]?.username} />
            <div>
              <h5>{conv.user?.[0]?.username}</h5>
              <p>{conv.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="messages-panel">
        {userId ? (
          <>
            <div className="messages-list">
              {messages && messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === user?.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" disabled={!messageText.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
