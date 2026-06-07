package com.chuch.Orderly.domain.restaurant.dto;

import com.chuch.Orderly.domain.restaurant.enums.TableStatus;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class TableResponse {

    private UUID id;
    private UUID restaurantId;
    private String tableNumber;
    private UUID qrCodeToken;
    private TableStatus status;
    private ZonedDateTime createdAt;
}
