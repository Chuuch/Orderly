package com.chuch.Orderly.domain.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTableRequest {

    @NotBlank
    @Size(max = 10)
    private String tableNumber;
}
