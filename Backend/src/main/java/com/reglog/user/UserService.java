package com.reglog.user;

import com.reglog.dto.RegisterRequest;
import com.reglog.dto.UserResponse;
import com.reglog.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Username '" + request.getName() + "' is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered.");
        }

        // Hash password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setName(request.getName().trim());
        user.setPassword(hashedPassword);
        user.setEmail(request.getEmail().trim());
        user.setPhone(request.getPhone().trim());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getUid(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone()
        );
    }

    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }

    public Optional<User> findById(Long uid) {
        return userRepository.findById(uid);
    }
}
