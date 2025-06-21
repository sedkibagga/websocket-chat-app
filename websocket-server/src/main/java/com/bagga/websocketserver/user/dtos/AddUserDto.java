package com.bagga.websocketserver.user.dtos;

import com.bagga.websocketserver.user.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AddUserDto {
    private String nickName;
    private String fullName;
    public String email;
    public String password;
}
