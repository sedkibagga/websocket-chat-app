import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import type { User } from '../types/Types';
const ChatUI: React.FC = () => {
  const {
    currentUser,
    users,
    chatMessages,
    sendChatMessage,
    // sendPrivateMessage,
    disconnect
  } = useChat();
  console.log("currentUser in ChatUI", currentUser);
  console.log("users in ChatUI", users);
  console.log("chatmessages in connect:", chatMessages);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState('');
  // const [privateMessageInput, setPrivateMessageInput] = useState('');

  const handleSendMessage = () => {
    if (selectedUser && messageInput.trim()) {
      // console.log("Sending message to:", selectedUser.fullName, "Message:", messageInput);
      sendChatMessage(selectedUser.fullName, messageInput);
      setMessageInput('');
    }
  };

  // const handleSendPrivateMessage = () => {
  //   if (selectedUser && privateMessageInput.trim()) {
  //     sendPrivateMessage(selectedUser.fullName, privateMessageInput);
  //     setPrivateMessageInput('');
  //   }
  // };

  if (!currentUser) return null;
  useEffect(() => {
    console.log('Chat messages updated:', chatMessages);
  }, [chatMessages]);
  return (
    <div className="chat-container">
      <header>
        <h2>Chat as {currentUser.fullName}</h2>
        <button onClick={disconnect}>Disconnect</button>
      </header>

      <div className="chat-content">
        <div className="user-list">
          <h3>Online Users</h3>
          <ul>
            {users.map(user => (
              <li

                className={user.fullName === selectedUser?.fullName ? 'selected' : ''}
                onClick={() => setSelectedUser(user)}
              >
                {user.fullName} ({user.status})
              </li>
            ))}
          </ul>
        </div>

        <div className="message-area">
          {selectedUser ? (
            <>
              <div className="chat-messages">
                <h3>Chat with {selectedUser.fullName}</h3>
                <div className="messages">
                  {chatMessages
                    .filter(msg =>
                      (msg.senderId === currentUser.fullName && msg.recipientId === selectedUser.fullName) ||
                      (msg.senderId === selectedUser.fullName && msg.recipientId === currentUser.fullName)
                    )
                    .map(msg => (
                      <div key={msg.id} className={`message ${msg.senderId === currentUser.fullName ? 'sent' : 'received'}`}>
                        <p>{msg.content}</p>
                        <small>{msg.timestamp?.toLocaleTimeString()}</small>
                      </div>
                    ))}
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>

              {/* <div className="private-messages">
                <h3>Private Messages</h3>
                <div className="private-messages-list">
                  {privateMessages.map((msg, index) => (
                    <div key={index} className="private-message">
                      {msg}
                    </div>
                  ))}
                </div>
                <div className="private-input">
                  <input
                    type="text"
                    value={privateMessageInput}
                    onChange={(e) => setPrivateMessageInput(e.target.value)}
                    placeholder="Send private notification..."
                  />
                  <button onClick={handleSendPrivateMessage}>Send Private</button>
                </div>
              </div> */}
            </>
          ) : (
            <div className="no-user-selected">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatUI;