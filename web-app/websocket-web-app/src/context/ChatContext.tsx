import React, { createContext, useContext, useState, useEffect } from 'react';
import { webSocketService } from '../services/WebSocketService';
import type { ChatMessage, User } from '../types/Types';

interface ChatContextType {
  currentUser: User | null;
  users: User[];
  chatMessages: ChatMessage[];
  privateMessages: string[];
  connect: (user: User) => void;
  disconnect: () => void;
  sendChatMessage: (recipientId: string, content: string) => void;
  // sendPrivateMessage: (recipient: string, content: string) => void;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = (user: User) => {
    setCurrentUser(user);
    console.log("Connecting user:", user);

    webSocketService.connect(
      user,
      (updatedUsers) => setUsers(prev => [...prev, ...updatedUsers]),
      // (message) => setPrivateMessages(prev => [...prev, message]),
      (notification) => {
        console.log('Received notification:', notification);
        setChatMessages(prev => {
          const newMessages = [...prev, {
            id: notification.id,
            chatId: notification.chatId,
            senderId: notification.senderId,
            recipientId: notification.recipientId,
            content: notification.content,
            timestamp: new Date()
          }];
          console.log('Updated messages:', newMessages);
          return newMessages;
        });
      },
      (error) => setError(error)
    );
  };

  const disconnect = () => {
    webSocketService.disconnect();
    setCurrentUser(null);
  };

  const sendChatMessage = (recipientId: string, content: string) => {
    if (!currentUser) return;
    // console.log("Sending chat message websocketService:", recipientId, "with content:", content);
    webSocketService.sendChatMessage(recipientId, content);
  };

  // const sendPrivateMessage = (recipient: string, content: string) => {
  //   if (!currentUser) return;

  //   webSocketService.sendPrivateMessage(recipient, content);
  //   setPrivateMessages(prev => [...prev, `You to ${recipient}: ${content}`]);
  // };

  useEffect(() => {
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider value={{
      currentUser,
      users,
      chatMessages,
      privateMessages,
      connect,
      disconnect,
      sendChatMessage,
      // sendPrivateMessage,
      error
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};