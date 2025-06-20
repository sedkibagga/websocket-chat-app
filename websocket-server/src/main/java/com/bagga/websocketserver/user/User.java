package com.bagga.websocketserver.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString
@Document
public class User {
    @Id
    private String id;
    private String nickName;
    private String fullName;
    private Status status;
}
