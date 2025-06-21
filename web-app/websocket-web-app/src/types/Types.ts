

export interface User {
  id?: string;
  fullName: string;
  nickName: string;
  status?: 'ONLINE' | 'OFFLINE';
  email: string;
}

export interface ChatMessage {
  id?: string;
  chatId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
}

export interface ChatRoom {
  id?: string;
  chatId: string;
  senderId: string;
  recipientId: string;
}

export interface ChatNotification {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
}

export interface PrivateMessage {
  recipient: string;
  content: string;
}