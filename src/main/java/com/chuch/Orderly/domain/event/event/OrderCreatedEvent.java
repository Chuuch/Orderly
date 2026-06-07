package com.chuch.Orderly.domain.event.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent extends DomainEvent{

    @JsonProperty("order_id")
    private UUID orderId;

    @JsonProperty("table_id")
    private UUID tableId;

    @JsonProperty("user_id")
    private UUID userId;

    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    @JsonProperty("items")
    private List<OrderItemEventDto> items;

    @JsonProperty("special_instructions")
    private String specialInstructions;

    public OrderCreatedEvent(
            UUID restaurantId,
            UUID orderId,
            UUID tableId,
            UUID userId,
            BigDecimal totalAmount,
            List<OrderItemEventDto> items,
            String specialInstructions) {
        super(restaurantId, orderId);
        this.orderId = orderId;
        this.tableId = tableId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.items = items;
        this.specialInstructions = specialInstructions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEventDto {
        @JsonProperty("menu_item_id")
        private UUID menuItemId;

        @JsonProperty("menu_item_name")
        private String menuItemName;

        @JsonProperty("quantity")
        private Integer quantity;

        @JsonProperty("unit_price")
        private BigDecimal unitPrice;

        @JsonProperty("special_instructions")
        private String specialInstructions;
    }
}
