package com.bagga.websocketserver.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        this.userRepository.save(user);
    }

    public void disconnect(User user) {
        var storedUser = this.userRepository.findById(user.getNickName())
                .orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            this.userRepository.save(storedUser);
        }
    }

    public List<User> findConnectUsers() {
        return this.userRepository.findAllByStatus(Status.ONLINE);
    }

    public List<User> findUsers() {
        return this.userRepository.findAll();
    }
    public void deleteAll() {
        this.userRepository.deleteAll();
    }

}
