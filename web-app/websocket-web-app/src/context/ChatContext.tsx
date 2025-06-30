import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { webSocketService } from '../services/WebSocketService';
import type { ChatMessage } from '../types/Types';
import apisController from '../apis/services/apisController';
import type { loginUserResponse } from '../apis/DataResponse/responses';
interface ChatContextType {
  currentUser: loginUserResponse | null;
  setCurrentUser:(currentUser: loginUserResponse | null) => void;
  users: loginUserResponse[];
  setUsers: (users: loginUserResponse[]) => void;
  senderId: string;
  setSenderId: (senderId: string) => void;
  recipientId: string;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  setRecipientId: (recipientId: string) => void;
  chatMessages: ChatMessage[];
  privateMessages: string[];
  connect: (user: loginUserResponse) => void;
  disconnect: () => void;
  sendChatMessage: (recipientId: string, content: string) => void;
  fetchUsers: () => Promise<void>;
  fetchChatMessages: (senderId: string, recipientId: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
  selectedUser: loginUserResponse | null;
  setSelectedUser: (user: loginUserResponse | null) => void;
  setPrivateMessages: (messages: string[]) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<loginUserResponse | null>(null);
  const [users, setUsers] = useState<loginUserResponse[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState<loginUserResponse | null>(null);

  const connect = async (user: loginUserResponse) => {
    setCurrentUser(user);
    console.log("Connecting user:", user);
     if (user.id && selectedUser?.id) {
      const existingMessages = await apisController.findChatMessages(user.id, selectedUser.id);
      setChatMessages(existingMessages);
      console.log("Fetched existing messages:", existingMessages);
    }
    webSocketService.connect(
      user,
      (updatedUsers) => setUsers(updatedUsers),
    
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
      // onError: (error) => setError(error)
    );
  };

  const disconnect = () => {
    webSocketService.disconnect();
    setCurrentUser(null);
  };

  const sendChatMessage = (recipientId: string, content: string) => {
    if (!currentUser) return;
    webSocketService.sendChatMessage(recipientId, content);
  };


  const fetchUsers = async () => {
    try {
      if (currentUser) {
        console.log("Fetching users for current user:", currentUser);
        const response = await apisController.findAllUsers();
        setUsers(response);
        webSocketService.findConnectedUsers();
      }
      return;

    } catch (error:any) {
      console.error('Failed to fetch users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }

  const fetchChatMessages = useCallback(async (senderId: string, recipientId: string) => {
    try {
      const response = await apisController.findChatMessages(senderId, recipientId);
      setChatMessages(prev => {
        // Merge new messages with existing ones, avoiding duplicates
        const newMessages = response.filter(newMsg => 
          !prev.some(existingMsg => existingMsg.id === newMsg.id)
        );
        return [...prev, ...newMessages];
      });
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  }, []);
  
  

  useEffect(() => {
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await localStorage.getItem('userData');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUser();
    fetchUsers();
    fetchChatMessages(senderId, recipientId); 

  }, []);
   
  useEffect(() => {
  if (currentUser) {
    connect(currentUser);
  }
}, [currentUser]);


  return (
    <ChatContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      setUsers,
      senderId,
      setSenderId,
      recipientId,
      setRecipientId,
      chatMessages,
      privateMessages,
      connect,
      disconnect,
      sendChatMessage,
      fetchUsers,
      fetchChatMessages,
      error,
      isConnected,
      setIsConnected,
      setError,
      selectedUser,
      setSelectedUser,
      setPrivateMessages
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