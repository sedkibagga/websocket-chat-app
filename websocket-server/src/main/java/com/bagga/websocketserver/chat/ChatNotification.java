package com.bagga.websocketserver.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {
    private String id ;
    private String chatId;
    private String senderId ;
    private String recipientId ;
    private String content ;
}
