package com.bagga.websocketserver.user;

import com.bagga.websocketserver.chat.ChatMessage;
import com.bagga.websocketserver.chat.ChatMessageRepository;
import com.bagga.websocketserver.chatroom.ChatRoomRepository;
import com.bagga.websocketserver.dtos.SendPublicMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
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

    public User addUser(@Payload User user) {
        System.out.println("Received user to save: " + user);
        this.userService.saveUser(user);

        return user;
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

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectUsers() {
        return ResponseEntity.ok(this.userService.findConnectUsers());
    }

    @MessageMapping("/findUsers/user.findConnectUsers")
    @SendTo("/topic/publicUsers/findConnectUsers")
    public List<User> findUsers() {
        return this.userService.findConnectUsers();
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<User>> findAllUsers() {
        return ResponseEntity.ok(this.userService.findUsers());
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
