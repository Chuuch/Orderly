package com.chuch.Orderly.domain.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private UUID id;
    private UUID menuId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer preparationTimeMinutes;
    private Boolean isAvailable;
    private Boolean isVegetarian;
    private Boolean isSpicy;
    private String allergens;
    private String imageUrl;
    private LocalDateTime createdAt;
}
