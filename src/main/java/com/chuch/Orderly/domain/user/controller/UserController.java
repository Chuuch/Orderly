package com.chuch.Orderly.domain.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chuch.Orderly.domain.user.dto.InviteStaffRequest;
import com.chuch.Orderly.domain.user.dto.UpdateUserRolesRequest;
import com.chuch.Orderly.domain.user.dto.UserResponse;
import com.chuch.Orderly.domain.user.service.UserService;

import jakarta.validation.Valid;
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
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        log.info("GET /api/v1/users/me - Fetching user {}", userId);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<List<UserResponse>> listRestaurantUsers(Authentication authentication) {
        UUID actorId = UUID.fromString(authentication.getName());
        UUID restaurantId = userService.getUserById(actorId).restaurantId();
        return ResponseEntity.ok(userService.listRestaurantUsers(restaurantId));
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<UserResponse> inviteStaff(
        Authentication authentication, 
        @Valid @RequestBody InviteStaffRequest request) {
            UUID actorId = UUID.fromString(authentication.getName());
            UUID restaurantId = userService.getUserById(actorId).restaurantId();
            UserResponse created = userService.inviteStaff(restaurantId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }

        @PutMapping("/{id}/roles")
        @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
        public ResponseEntity<UserResponse> updateUserRoles(
                Authentication authentication,
                @PathVariable UUID id,
                @Valid @RequestBody UpdateUserRolesRequest request
        ) {
            UUID actorId = UUID.fromString(authentication.getName());
            UUID restaurantId = userService.getUserById(actorId).restaurantId();
            return ResponseEntity.ok(
                    userService.updateUserRoles(restaurantId, id, actorId, request)
            );
        }
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
        public ResponseEntity<Void> deactivateUser(
                Authentication authentication,
                @PathVariable UUID id
        ) {
            UUID actorId = UUID.fromString(authentication.getName());
            UUID restaurantId = userService.getUserById(actorId).restaurantId();
            userService.deactivateUser(restaurantId, id, actorId);
            return ResponseEntity.noContent().build();
        }
}
