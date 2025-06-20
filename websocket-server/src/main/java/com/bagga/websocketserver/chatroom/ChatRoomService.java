package com.bagga.websocketserver.chatroom;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    public Optional<String> getChatRoomId (String senderId, String recipientId,boolean createNewRoomIfNotExists) {

        return this.chatRoomRepository.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(ChatRoom::getChatId)
                //or means if chatroom in map does not exist
                .or(()->{
                    if(createNewRoomIfNotExists){
                         var chatId = createChatId(senderId,recipientId);
                         return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatId(String senderId, String recipientId) {
        var chatId = String.format("%s_%s",senderId,recipientId);
        ChatRoom senderRecipient = ChatRoom.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();
        ChatRoom recipientSender = ChatRoom.builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();
        this.chatRoomRepository.save(senderRecipient);
        this.chatRoomRepository.save(recipientSender);
        return chatId;
    }
}
