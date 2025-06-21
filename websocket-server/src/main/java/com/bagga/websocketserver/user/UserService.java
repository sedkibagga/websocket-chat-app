package com.bagga.websocketserver.user;

import com.bagga.websocketserver.user.dtos.LoginUserDto;
import com.bagga.websocketserver.user.responses.AddUserResponse;
import com.bagga.websocketserver.user.responses.FindAllUsersResponse;
import com.bagga.websocketserver.user.responses.LoginUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public AddUserResponse saveUser(User user) {
        User savedUser = this.userRepository.save(user);
        return AddUserResponse.builder()
                .id(savedUser.getId())
                .nickName(savedUser.getNickName())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .status(savedUser.getStatus())
                .build();
    }

    public LoginUserResponse loginUser (LoginUserDto loginUserDto){
        try{
            if (!this.userRepository.findByEmail(loginUserDto.getEmail()).isPresent()) {
                throw new RuntimeException("User not found");
            }
            User user = this.userRepository.findByEmail(loginUserDto.getEmail()).get();
            if (!user.getPassword().equals(loginUserDto.getPassword())) {
                throw new RuntimeException("Wrong password");
            }
            user.setStatus(Status.ONLINE);
            this.userRepository.save(user);
            return LoginUserResponse.builder()
                    .id(user.getId())
                    .nickName(user.getNickName())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .status(user.getStatus())
                    .build();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public void disconnect(User user) {
        var storedUser = this.userRepository.findById(user.getNickName())
                .orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            this.userRepository.save(storedUser);
        }
    }

    public List<FindAllUsersResponse> findAllUsers() {
       // return this.userRepository.findAllByStatus(Status.ONLINE);
       List<User> users = this.userRepository.findAll();
       return users.stream()
               .map(user -> FindAllUsersResponse.builder()
                       .id(user.getId())
                       .nickName(user.getNickName())
                       .fullName(user.getFullName())
                       .email(user.getEmail())
                       .status(user.getStatus())
                       .build()
               )
               .collect(Collectors.toList());


    }

    public void deleteAll() {
        this.userRepository.deleteAll();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User findByEmail(String email) {
        try {
            if (this.userRepository.findByEmail(email).isPresent()) {
                return this.userRepository.findByEmail(email).get();
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }
}
