package com.chuch.Orderly.domain.kitchen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenWebSocketMessage {
    private String type; // ORDER_CREATED, ORDER_STATUS_CHANGED
    private Object payload; // OrderCreatedEvent or OrderStatusChangedEvent
}
