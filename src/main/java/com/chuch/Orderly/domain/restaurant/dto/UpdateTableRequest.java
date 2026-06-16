package com.chuch.Orderly.domain.restaurant.dto;

import com.chuch.Orderly.domain.restaurant.enums.TableStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTableRequest(
    @NotBlank @Size(max = 10) String tableNumber,
    TableStatus status
) {
    
}
