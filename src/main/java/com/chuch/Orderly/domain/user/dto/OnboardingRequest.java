package com.chuch.Orderly.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OnboardingRequest(
    @NotBlank @Size(max = 100) String restaurantName,
    @NotBlank @Size(max = 50) String subdomain,
    String address,
    String phoneNumber,

    @NotBlank @Size(min = 2, max = 100) String firstName,
    @NotBlank @Size(min = 2, max = 100) String lastName,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password
) {
    
}
