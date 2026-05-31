package com.chuch.Orderly.domain.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateRestaurantRequest(
        @NotBlank(message = "Името на ресторант не може да бъде празно.")
        @Size(max = 100, message = "Името не може да надвишава 100 символа.")
        String name,

        @Size(max = 255, message = "Адресът не може да надвишажа 255 символа.")
        String address,

        @Size(max = 20, message = "Телефонният номер не може да надвишава 20 символа.")
        String phoneNumber,

        boolean isActive
        ) {
}
