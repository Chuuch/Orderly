package com.chuch.Orderly.domain.order.mapper;

import com.chuch.Orderly.domain.order.dto.OrderItemResponse;
import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.order.entity.Order;
import com.chuch.Orderly.domain.order.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    default Set<OrderItemResponse> mapOrderItems(Set<OrderItem> items) {
        return items.stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toSet());
    }

    default OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        BigDecimal subTotal = orderItem.getUnitPrice()
                .multiply(new BigDecimal(orderItem.getQuantity()));

        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .menuItemId(orderItem.getMenuItem().getId())
                .menuItemName(orderItem.getMenuItem().getName())
                .quantity(orderItem.getQuantity())
                .unitPrice(orderItem.getUnitPrice())
                .subTotal(subTotal)
                .specialInstructions(orderItem.getSpecialInstructions())
                .createdAt(orderItem.getCreatedAt())
                .build();
    }
}
