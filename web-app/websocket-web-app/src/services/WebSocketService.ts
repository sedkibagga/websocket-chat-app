import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { User } from '../types/Types';
import type { ChatMessage, ChatNotification } from '../types/Types';
import type { loginUserResponse } from '../apis/DataResponse/responses';
class WebSocketService {
  private stompClient: Client | null = null;
  private currentUser: loginUserResponse | null = null;

  connect(
    user: loginUserResponse,
    onUserListUpdated: (users: loginUserResponse[]) => void,
    // onPrivateMessage: (message: string) => void,
    onChatMessage: (notification: ChatNotification) => void,
    onError: (error: string) => void
  ) {
    this.currentUser = user;

    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log('[WS]', str),
      connectHeaders: {
        'username': user.fullName
      }
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');

      
      this.stompClient?.publish({
        destination: '/app/addUser/user.addUser',
        body: JSON.stringify(user)
      });

      
      this.stompClient?.subscribe('/topic/publicUsers/findUsers', (message) => {
        const updatedUsers = JSON.parse(message.body) as loginUserResponse[];
        onUserListUpdated(updatedUsers);
      });

      this.stompClient?.subscribe('/topic/publicUsers/addUser', (message) => {
        const newUser = JSON.parse(message.body) as loginUserResponse;
        onUserListUpdated([newUser]); 
      });

      
     

      this.stompClient?.subscribe(`/user/${user.fullName}/queue/messages`, (message) => {
        console.log(`Subscribed to /user/${user.fullName}/queue/messages`);
        console.log("Received chat message in my private queue:", message.body);
        try {
          const notification = JSON.parse(message.body) as ChatNotification;
          console.log("Parsed notification:", notification);
          onChatMessage(notification);
        } catch (e) {
          console.error("Failed to parse chat notification:", e, message.body);
        }
      });
      this.stompClient?.watchForReceipt('message-receipt', (frame) => {
        console.log('Subscription confirmed:', frame);
      });
      this.findConnectedUsers();
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.log('WebSocket closed:', event);
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers.message);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.currentUser) {
      this.stompClient.publish({
        destination: '/app/disconnect/user.disconnectUser',
        body: JSON.stringify(this.currentUser)
      });
      this.stompClient.deactivate();
    }
  }

  // sendPrivateMessage(recipient: string, content: string) {
  //   if (this.stompClient && this.currentUser) {
  //     this.stompClient.publish({
  //       destination: '/app/user.private',
  //       body: JSON.stringify({
  //         fullName: recipient,
  //         nickName: content
  //       })
  //     });
  //   }
  // }

  sendChatMessage(recipientId: string, content: string) {
    // console.log("receive from chatcontext:", recipientId, "with content:", content);
    console.log("this.currentUser:", this.currentUser);
    console.log("this.stompClient:", this.stompClient);
    if (this.stompClient && this.currentUser) {
      console.log("currentUser in sendChatMessage:", this.currentUser);
      const chatMessage: ChatMessage = { //ymkn ysir prob fil chatId 
        senderId: this.currentUser.fullName,
        recipientId,
        content,
        timestamp: new Date()
      };
      console.log("Sending chat message:", chatMessage);

      this.stompClient.publish({
        destination: '/app/chat/privateMessage',
        body: JSON.stringify(chatMessage),
      });
    }
  }
  findConnectedUsers() {
    if (this.stompClient) {
      this.stompClient.publish({
        destination: '/app/findUsers/user.findUsers',

      });
    }

  }
}

export const webSocketService = new WebSocketService();