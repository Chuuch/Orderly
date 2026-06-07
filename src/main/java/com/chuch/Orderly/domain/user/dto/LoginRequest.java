package com.chuch.Orderly.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Имейлът е задължителен")
    @Email
    String email,

    @NotBlank(message = "Паролата е задължителна")
    String password
) {
    
}
