package com.chuch.Orderly.domain.user.dto;

import java.time.ZonedDateTime;
import java.util.Set;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    UUID restaurantId,
    boolean isActive,
    Set<String> roles,
    ZonedDateTime createdAt,
    ZonedDateTime lastLogin
) {
    
}
