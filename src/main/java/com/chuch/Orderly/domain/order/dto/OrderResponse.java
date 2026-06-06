package com.chuch.Orderly.domain.order.dto;

import com.chuch.Orderly.domain.order.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {

    private UUID id;
    private UUID restaurantId;
    private UUID restaurantTableId;
    private UUID userId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private String specialInstructions;
    private Set<OrderItemResponse> items;
    private LocalDateTime estimatedReadyTime;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
