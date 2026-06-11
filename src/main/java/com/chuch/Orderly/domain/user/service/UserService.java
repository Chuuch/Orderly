package com.chuch.Orderly.domain.user.service;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chuch.Orderly.domain.user.dto.InviteStaffRequest;
import com.chuch.Orderly.domain.user.dto.UpdateUserRolesRequest;
import com.chuch.Orderly.domain.user.dto.UserResponse;
import com.chuch.Orderly.domain.user.entity.Role;
import com.chuch.Orderly.domain.user.entity.User;
import com.chuch.Orderly.domain.user.enums.RoleType;
import com.chuch.Orderly.domain.user.mapper.UserMapper;
import com.chuch.Orderly.domain.user.repository.RoleRepository;
import com.chuch.Orderly.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String GUEST_EMAIL = "qr-guest@orderly.com";
    private static final Set<RoleType> ASSIGNABLE_ROLES = EnumSet.of(
            RoleType.RESTAURANT_ADMIN,
            RoleType.KITCHEN_STAFF,
            RoleType.WAITER);

    @Transactional(readOnly = true)
    public List<UserResponse> listRestaurantUsers(UUID restaurantId) {
        return userRepository.findByRestaurantIdAndIsActiveTrue(restaurantId).stream()
                .filter(user -> !GUEST_EMAIL.equalsIgnoreCase(user.getEmail()))
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse inviteStaff(UUID restaurantId, InviteStaffRequest request) {
        if (userRepository.existsByEmailAndRestaurantId(request.email(), restaurantId)) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        validateAssignableRoles(request.roles());

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .restaurantId(restaurantId)
                .isActive(true)
                .roles(resolveRoles(request.roles()))
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUserRoles(
            UUID restaurantId,
            UUID targetUserId,
            UUID actorUserId,
            UpdateUserRolesRequest request) {
        validateAssignableRoles(request.roles());

        User target = getRestaurantUser(restaurantId, targetUserId);
        User actor = getRestaurantUser(restaurantId, actorUserId);

        if (target.getId().equals(actor.getId())
                && !request.roles().contains(RoleType.RESTAURANT_ADMIN)) {
            throw new IllegalStateException("You cannot remove yout own admin access");
        }

        if (target.getRoles().stream().anyMatch(r -> r.getRoleType() == RoleType.RESTAURANT_ADMIN)
                && !request.roles().contains(RoleType.RESTAURANT_ADMIN)) {
            ensureAnotherAdminExists(restaurantId, targetUserId);
        }

        target.setRoles(resolveRoles(request.roles()));
        return userMapper.toResponse(userRepository.save(target));
    }

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
    public void deactivateUser(UUID restaurantId, UUID targetUserId, UUID actorUserId) {
        if (targetUserId.equals(actorUserId)) {
            throw new IllegalStateException("You cannot deactivate yourself!");
        }

        User target = getRestaurantUser(restaurantId, targetUserId);

        if (target.getRoles().stream().anyMatch(r -> r.getRoleType() == RoleType.RESTAURANT_ADMIN)) {
            ensureAnotherAdminExists(restaurantId, targetUserId);
        }

        target.setActive(false);
        userRepository.save(target);
    }

    private User getRestaurantUser(UUID restaurantId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!restaurantId.equals(user.getRestaurantId())) {
            throw new IllegalArgumentException("User does not belong to this restaurant");
        }
        return user;
    }

    private void ensureAnotherAdminExists(UUID restaurantId, UUID excludedUserId) {
        boolean hasOtherAdmin = userRepository.findByRestaurantIdAndIsActiveTrue(restaurantId).stream()
                .filter(u -> !u.getId().equals(excludedUserId))
                .anyMatch(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getRoleType() == RoleType.RESTAURANT_ADMIN));

        if (!hasOtherAdmin) {
            throw new IllegalStateException("Restaurant must have at least one active admin");
        }
    }

    private void validateAssignableRoles(Set<RoleType> roles) {
        if (roles.isEmpty() || !ASSIGNABLE_ROLES.contains(roles)) {
            throw new IllegalArgumentException("Invalid role assignment");
        }

        if (roles.contains(RoleType.CUSTOMER)) {
            throw new IllegalArgumentException("CUSTOMER role cannot be assigned to staff");
        }
    }

    private Set<Role> resolveRoles(Set<RoleType> roleTypes) {
        return roleTypes.stream()
                .map(type -> roleRepository.findByRoleType(type)
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + type)))
                .collect(Collectors.toSet());
    }

}
