package com.bagga.websocketserver.chat;

import com.bagga.websocketserver.chatroom.ChatRoomRepository;
import com.bagga.websocketserver.chatroom.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    public ChatMessage save (ChatMessage chatMessage) {
        var chatId = this.chatRoomService.getChatRoomId(
                chatMessage.getSenderId(),
                chatMessage.getRecipientId(),
                true
        ).orElseThrow();
        chatMessage.setChatId(chatId);
        ChatMessage savedChatMessage = this.chatMessageRepository.save(chatMessage);
         System.out.println(savedChatMessage);
        return savedChatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = this.chatRoomService.getChatRoomId(
                senderId,
                recipientId,
                false
        );
        return chatId.map(this.chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }
}
