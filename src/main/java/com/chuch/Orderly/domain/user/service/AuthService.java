package com.chuch.Orderly.domain.user.service;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chuch.Orderly.domain.user.dto.AuthResponse;
import com.chuch.Orderly.domain.user.dto.LoginRequest;
import com.chuch.Orderly.domain.user.dto.RegisterRequest;
import com.chuch.Orderly.domain.user.entity.Role;
import com.chuch.Orderly.domain.user.entity.User;
import com.chuch.Orderly.domain.user.enums.RoleType;
import com.chuch.Orderly.domain.user.mapper.UserMapper;
import com.chuch.Orderly.domain.user.repository.RoleRepository;
import com.chuch.Orderly.domain.user.repository.UserRepository;
import com.chuch.Orderly.domain.user.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.email());

        if (userRepository.existsByEmailAndRestaurantId(request.email(), request.restaurantId())) {
            log.warn("User with email {} already exists for restaurant {}", request.email(), request.restaurantId());
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        Role defaultRole = roleRepository.findByRoleType(RoleType.RESTAURANT_ADMIN)
        .orElseThrow(() -> new IllegalStateException("Default role not found"));
        user.setRoles(new HashSet<>(Set.of(defaultRole)));

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRestaurantId());
        long expiresIn = jwtTokenProvider.getExpirationTime();

        return new AuthResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getRestaurantId(),
            roleNames(savedUser),
            token,
            expiresIn
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Logging in user with email: {}", request.email());

        User user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> {
            log.warn("Login fialed: User with email {} not found", request.email());
            return new IllegalArgumentException("Invalid email or password");
        });

        if (!user.isActive()) {
            log.warn("Login failed: User {} is inactive", request.email());
            throw new IllegalStateException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())){
            log.warn("Login failed: Incorrect password for user {}", request.email());
            throw new IllegalArgumentException("Invalid email or password");
        }

        user.setLastLogin(ZonedDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getRestaurantId());
        long expiresIn = jwtTokenProvider.getExpirationTime();

        log.info("User {} logged in successfully", request.email());

        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRestaurantId(),
            roleNames(user),
            token,
            expiresIn
        );
    }

    private Set<String> roleNames(User user) {
        return user.getRoles().stream()
        .map(r -> r.getRoleType().name())
        .collect(Collectors.toSet());
    }
}
