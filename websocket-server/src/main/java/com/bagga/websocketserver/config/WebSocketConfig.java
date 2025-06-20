package com.bagga.websocketserver.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS() ;
    }

    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver() ;
        resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter() ;
        converter.setObjectMapper(new ObjectMapper());
        converter.setContentTypeResolver(resolver);
        messageConverters.add(converter) ;
        return false;
    }


}


//Explanation:
//Configures the message broker and destination prefixes
//
//enableSimpleBroker("/topic", "/queue"):
//
//Enables a simple in-memory broker
//
//Clients can subscribe to destinations prefixed with /topic or /queue
//
//Example: Client subscribes to /topic/notifications to receive broadcast messages
//
//setApplicationDestinationPrefixes("/app"):
//
//Prefix for messages that are bound for @MessageMapping methods
//
//Example: Client sends to /app/chat, which routes to a controller method annotated with @MessageMapping("/chat")
//
//setUserDestinationPrefix("/user"):
//
//Enables user-specific messaging
//
//Example: Messages sent to /user/queue/notifications will be routed to a specific user's queue
//Explanation:
//Registers STOMP endpoints
//
//addEndpoint("/ws"):
//
//The endpoint clients will connect to (e.g., ws://localhost:8080/ws)
//
//setAllowedOriginPatterns("*"):
//
//Allows connections from any origin (for development; restrict in production)
//
//withSockJS():
//
//Enables SockJS fallback options for browsers that don't support WebSocket
//
//Client would connect using http://localhost:8080/ws with SockJS protocol
///app Prefix (Application Destinations)
//Used for general message handling where messages are processed by @MessageMapping methods
//
//Messages sent to /app/... are routed to your controller methods
//
//Typically used for broadcasting or general message processing
//
///user Prefix (User Destinations)
//Used for private user-specific messages
//
//Automatically translates to user-specific queues
//
//Requires an authenticated user session
//
//Managed by Spring's UserDestinationMessageHandler
//
//Client-Side Examples
//1. /app Example (General Messaging)
//Client sending a message:
//
//javascript
//// Send a public chat message
//stompClient.send("/app/chat", {}, JSON.stringify({
//    content: "Hello everyone!",
//    sender: "Alice"
//}));
//Client subscribing to a public topic:
//
//javascript
//// Subscribe to public chat messages
//stompClient.subscribe('/topic/publicChat', function(message) {
//    const chatMsg = JSON.parse(message.body);
//    console.log("Public message received:", chatMsg.content);
//});
//Server-side handling:
//
//java
//@MessageMapping("/chat")  // Note: Just "/chat" here, not "/app/chat"
//public void handlePublicChat(ChatMessage message) {
//    // Process and broadcast to all subscribers
//    messagingTemplate.convertAndSend("/topic/publicChat", message);
//}
//2. /user Example (Private Messaging)
//Client sending a private message:
//
//javascript
//// Send a private message to user "Bob"
//stompClient.send("/app/private-message", {}, JSON.stringify({
//    recipient: "Bob",
//    content: "Hi Bob, this is private!",
//    sender: "Alice"
//}));
//Client subscribing to private queue:
//
//javascript
//// Subscribe to personal private messages
//stompClient.subscribe('/user/queue/private', function(message) {
//    const privateMsg = JSON.parse(message.body);
//    console.log("Private message received:", privateMsg.content);
//});
//Server-side handling:
//
//java
//@MessageMapping("/private-message")
//public void handlePrivateMessage(ChatMessage message, Principal principal) {
//    // Send only to the recipient
//    messagingTemplate.convertAndSendToUser(
//        message.getRecipient(),
//        "/queue/private",
//        message
//    );
//}
//How User-Specific Messaging Works in Spring WebSocket
//The magic of /user destinations is handled by Spring's UserDestinationMessageHandler. Here's exactly how the system ensures User A gets their messages and User B gets theirs:
//
//1. Automatic Queue Translation
//When a client subscribes to /user/queue/private:
//
//Spring automatically translates this to a unique queue per user
//
//The actual physical queue name becomes something like: /queue/private-user123 (where "user123" is the username)
//
//Example Flow:
//
//User A (username: alice123) subscribes:
//
//javascript
//stompClient.subscribe('/user/queue/private', callback);
//Internally becomes: /queue/private-alice123
//
//User B (username: bob456) subscribes:
//
//javascript
//stompClient.subscribe('/user/queue/private', callback);
//Internally becomes: /queue/private-bob456
//
//2. Server-Side Message Targeting
//When sending a message to a specific user:
//
//java
//@MessageMapping("/private-message")
//public void handlePrivateMessage(PrivateMessage message, Principal principal) {
//    // Send to specific user
//    messagingTemplate.convertAndSendToUser(
//        message.getRecipient(), // "alice123" or "bob456"
//        "/queue/private",
//        message
//    );
//}
//Spring will:
//
//Take the recipient username ("alice123")
//
//Combine with the destination ("/queue/private")
//
//Send to the physical queue: /queue/private-alice123
//
//3. Authentication Context
//The security comes from:
//
//WebSocket authentication - Users must authenticate (usually via STOMP headers or HTTP session)
//
//Principal binding - Spring binds the subscription to the authenticated user
//
//Automatic routing - Messages sent to a user only reach their specific queue
//Full Example
//Client-Side (JavaScript)
//javascript
//// Connect with authentication
//let headers = {
//    'X-Authorization': 'Bearer ' + authToken,
//    'heart-beat': '10000,10000'
//};
//
//stompClient.connect(headers, function(frame) {
//    // Subscribe to private queue
//    stompClient.subscribe('/user/queue/private', function(message) {
//        const msg = JSON.parse(message.body);
//        console.log(`${msg.sender} says: ${msg.content}`);
//    });
//
//    // Send private message
//    function sendPrivate() {
//        stompClient.send("/app/private", {}, JSON.stringify({
//            recipient: "bob456",
//            content: "Secret message for Bob"
//        }));
//    }
//});
//Server-Side (Java)
//java
//@Controller
//public class PrivateMessageController {
//
//    @MessageMapping("/private")
//    public void handlePrivateMessage(
//        @Payload PrivateMessage message,
//        Principal sender
//    ) {
//        // message.getRecipient() = "bob456"
//        // sender.getName() = "alice123"
//
//        messagingTemplate.convertAndSendToUser(
//            message.getRecipient(),
//            "/queue/private",
//            new PrivateMessage(
//                sender.getName(),
//                message.getRecipient(),
//                message.getContent()
//            )
//        );
//    }
//}
//@SendToUser Annotation
//Direct Response to Message:
//
//Used when you want to send a response back to the user who sent the original message
//
//Automatically determines the recipient from the current session/principal