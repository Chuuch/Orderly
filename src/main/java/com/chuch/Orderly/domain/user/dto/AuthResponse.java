package com.chuch.Orderly.domain.user.dto;

import java.util.UUID;

public record AuthResponse(
    UUID userId,
    String email,
    String firstName,
    String lastName,
    UUID restaurantId,
    String accessToken,
    long expiresIn
) {
    
}
