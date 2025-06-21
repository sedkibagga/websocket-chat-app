package com.bagga.websocketserver.user.responses;

import com.bagga.websocketserver.user.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserResponse {
    private String id;
    private String nickName;
    private String fullName;
    public String email;
    private Status status;
}
