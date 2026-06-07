package com.chuch.Orderly.domain.user.dto;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Първото име е задължително")
        @Size(min = 2, max = 100)
        String firstName,

        @NotBlank(message = "Фамилията е задължителна")
        @Size(min = 2, max = 100)
        String lastName,
        
        @NotBlank(message = "Имейлът е задължителен")
        @Email(message = "Невалиден имейл формат")
        String email,
        
        @NotBlank(message = "Паролата е задължителна")
        @Size(min = 8, message = "Паролата трябва да съдържа поне 8 символа")
        String password,
        
        UUID restaurantId
        ) {

}
