package com.bagga.websocketserver.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendPublicMessageDto {
    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;
    private Date timestamp;
}
