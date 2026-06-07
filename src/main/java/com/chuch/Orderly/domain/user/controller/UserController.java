package com.chuch.Orderly.domain.user.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chuch.Orderly.domain.user.dto.UserResponse;
import com.chuch.Orderly.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER')")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        log.info("GET /api/v1/users/{} - Fetching user", id);
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id) {
        log.info("DELETE /api/v1/users/{} - Deactivating user", id);
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}
