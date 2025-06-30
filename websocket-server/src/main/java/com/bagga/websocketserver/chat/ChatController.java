package com.bagga.websocketserver.chat;

import com.bagga.websocketserver.chatroom.ChatRoom;
import com.bagga.websocketserver.chatroom.ChatRoomRepository;
import com.bagga.websocketserver.chatroom.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {
    @Autowired
    private final ChatMessageService chatMessageService;
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomRepository  chatRoomRepository;
    private final ChatRoomService chatRoomService;
    @MessageMapping("/chat/privateMessage")
    public void processMessage(@Payload ChatMessage chatMessage) {
        System.out.println("Received chat message: " + chatMessage);
        ChatMessage savedMsg = this.chatMessageService.save(chatMessage);
        System.out.println("Saved chat message: " + savedMsg);
        System.out.println("Sending to user: " + chatMessage.getRecipientId());
        System.out.println("Full destination: /user/" + chatMessage.getRecipientId() + "/queue/messages");
        this.messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                "/queue/messages",
                ChatNotification.builder()
                        .id(savedMsg.getId())
                        .chatId(savedMsg.getChatId())
                        .senderId(savedMsg.getSenderId())
                        .recipientId(savedMsg.getRecipientId())
                        .content(savedMsg.getContent())
                        .build()
        );

        this.messagingTemplate.convertAndSendToUser(
                chatMessage.getSenderId(),
                "/queue/messages",
                ChatNotification.builder()
                        .id(savedMsg.getId())
                        .chatId(savedMsg.getChatId())
                        .senderId(savedMsg.getSenderId())
                        .recipientId(savedMsg.getRecipientId())
                        .content(savedMsg.getContent())
                        .build()
        );


    }
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable("senderId") String senderId, @PathVariable("recipientId") String recipientId) {
        return ResponseEntity.ok(this.chatMessageService.findChatMessages(senderId, recipientId));
    }

    @GetMapping("/AllChatRooms")
    public ResponseEntity<List<ChatRoom>> findAllChatRooms() {
        return ResponseEntity.ok(this.chatRoomRepository.findAll());
    }

    @GetMapping("/findChatRoomByChatId/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatRoom>> findChatRoomByChatId(@PathVariable("senderId") String senderId, @PathVariable("recipientId") String recipientId) {
        return ResponseEntity.ok(this.chatRoomService.findChatRoomByChatId(senderId,recipientId));
    }

}
