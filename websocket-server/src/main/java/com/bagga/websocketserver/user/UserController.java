package com.bagga.websocketserver.user;

import com.bagga.websocketserver.chat.ChatMessage;
import com.bagga.websocketserver.chat.ChatMessageRepository;
import com.bagga.websocketserver.chatroom.ChatRoomRepository;
import com.bagga.websocketserver.dtos.SendPublicMessageDto;
import com.bagga.websocketserver.user.dtos.AddUserDto;
import com.bagga.websocketserver.user.dtos.LoginUserDto;
import com.bagga.websocketserver.user.dtos.LogoutUserDto;
import com.bagga.websocketserver.user.responses.AddUserResponse;
import com.bagga.websocketserver.user.responses.FindAllUsersResponse;
import com.bagga.websocketserver.user.responses.LoginUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/addUser/user.addUser") // Handles messages sent to /app/user.addUser (because of setApplicationDestinationPrefixes("/app"))
    @SendTo("/topic/publicUsers/addUser") // Broadcasts the response to all clients subscribed to /user/topic

    // Client sends user data: stompClient.send("/app/user.addUser", {}, JSON.stringify({username: "john", email: "john@example.com"}));
    // Server receives it at /app/user.addUser and maps it here using @MessageMapping
    // @Payload automatically converts the JSON into a User object
    // Server processes: userService.saveUser(user); and returns the saved user
    // Response is sent to /user/topic and broadcast to all subscribed clients
    // Client subscribes: stompClient.subscribe('/user/topic', (message) => { const user = JSON.parse(message.body); console.log("New user added:", user.username); });

    public AddUserResponse addUser(@Payload AddUserDto userDto) {
       try {
           if (this.userService.existsByEmail(userDto.getEmail())) {
               throw new RuntimeException("User with email " + userDto.getEmail() + " already exists");
           }
           User user = User.builder()
                   .nickName(userDto.getNickName())
                   .fullName(userDto.getFullName())
                   .email(userDto.getEmail())
                   .password(userDto.getPassword())
                   .status(Status.OFFLINE)
                   .build();

           return this.userService.saveUser(user);
       }catch (Exception e) {
           log.error(e.getMessage());
           throw new RuntimeException(e.getMessage());

       }

    }



//    @MessageMapping("/send/user.private")
//    public void privateMessage(@Payload User user) {
//       this.messagingTemplate.convertAndSendToUser(
//               //The convertAndSendToUser(...) method prepends /user/ automatically, so you don’t do it manually.
//               user.getFullName(),
//               "/queue/private",
//               "From" + user.getFullName()
//       );
//    }

    @MessageMapping("/disconnect/user.disconnectUser")
    @SendTo("/topic/publicUsers/disconnectUser")
    public User disconnect(@Payload User user) {
        this.userService.disconnect(user);
        return user;
    }



    @MessageMapping("/findUsers/user.findUsers")
    @SendTo("/topic/publicUsers/findUsers")
    public List<FindAllUsersResponse> findUsers() {
        return this.userService.findAllUsers();
    }

    @PostMapping("/loginUser")
    public LoginUserResponse loginUser (@RequestBody LoginUserDto userDto) {
        return this.userService.loginUser(userDto);
    }
    @PostMapping("/addUser")
    public AddUserResponse addUserInHttpPost (@RequestBody AddUserDto userDto) {
        try {
            if (this.userService.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("User with email " + userDto.getEmail() + " already exists");
            }
            User user = User.builder()
                    .nickName(userDto.getNickName())
                    .fullName(userDto.getFullName())
                    .email(userDto.getEmail())
                    .password(userDto.getPassword())
                    .status(Status.OFFLINE)
                    .build();

            return this.userService.saveUser(user);
        }catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());

        }
    }

    @PostMapping("/logoutUser")
    public void logoutUser (@RequestBody LogoutUserDto userDto) {
        try{
            if (!this.userService.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("User not found");
            }
            User user = this.userService.findByEmail(userDto.getEmail());
            user.setStatus(Status.OFFLINE);
            this.userService.saveUser(user);
        }catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
    @GetMapping("/findAllUsers")
    public ResponseEntity<List<FindAllUsersResponse>> findAllUsers() {
        return ResponseEntity.ok(this.userService.findAllUsers());
    }
    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        this.userService.deleteAll();
    }

    @DeleteMapping("/deleteAllMessagesAndChatRooms")
    public void deleteAllMessagesAndChatRooms() {
        this.chatMessageRepository.deleteAll();
        this.chatRoomRepository.deleteAll();
    }

//    @MessageMapping("/sendPublicMessage/user.sendPublicMessage")
//    @SendTo("/topic/publicUsers/sendPublicMessage")
//    public ChatMessage sendPublicMessage(@Payload SendPublicMessageDto message) {
//
//    }
}
