package com.bagga.websocketserver.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAllByStatus(Status status);
    Optional<User> findByEmail(String email);
}
