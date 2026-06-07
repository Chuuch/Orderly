package com.chuch.Orderly.domain.order.mapper;

import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.order.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(Order order);
}
