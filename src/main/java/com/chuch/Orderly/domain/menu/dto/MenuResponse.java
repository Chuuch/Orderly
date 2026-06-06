package com.chuch.Orderly.domain.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuResponse {

    private UUID id;
    private UUID restaurantId;
    private String name;
    private String description;
    private Boolean isActive;
    private Set<MenuItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
