package com.chuch.Orderly.domain.event.event;

import com.chuch.Orderly.domain.order.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusChangedEvent extends DomainEvent {

    @JsonProperty("order_id")
    private UUID orderId;

    @JsonProperty("old_status")
    private OrderStatus oldStatus;

    @JsonProperty("new_status")
    private OrderStatus newStatus;

    @JsonProperty("table_id")
    private UUID tableId;

    @JsonProperty("changed_by")
    private UUID changedBy;

    public OrderStatusChangedEvent(
            UUID restaurantId,
            UUID orderId,
            UUID tableId,
            OrderStatus oldStatus,
            OrderStatus newStatus,
            UUID changedBy) {
        super(restaurantId, orderId);
        this.orderId = orderId;
        this.tableId = tableId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
    }
}
