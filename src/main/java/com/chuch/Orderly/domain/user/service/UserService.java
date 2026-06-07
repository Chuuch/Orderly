package com.chuch.Orderly.domain.user.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chuch.Orderly.domain.user.dto.UserResponse;
import com.chuch.Orderly.domain.user.entity.User;
import com.chuch.Orderly.domain.user.mapper.UserMapper;
import com.chuch.Orderly.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        log.info("Fetching user with ID: {}", userId);

        User user = userRepository.findById(userId)
        .orElseThrow(() -> {
            log.warn("User with ID {} not found", userId);
            return new IllegalArgumentException("User not found");
        });
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void deactivateUser(UUID userId) {
        log.info("Deactivating user with ID: {}", userId);

        User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setActive(false);
        userRepository.save(user);

        log.info("User {} deactivated successfully", userId);
    }

}
