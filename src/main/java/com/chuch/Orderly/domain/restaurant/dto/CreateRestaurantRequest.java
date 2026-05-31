package com.chuch.Orderly.domain.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRestaurantRequest(
        @NotBlank(message = "Името на ресторанта е задължително")
        @Size(max = 100, message = "Името не може да е над 100 символа")
        String name,

        @NotBlank(message = "Субдомейнът е задължителен")
        @Size(max = 50, message = "Субдомейнът не може да е над 50 символа")
        String subdomain,

        String address,
        String phoneNumber
) {
}
