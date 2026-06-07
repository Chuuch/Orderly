package com.chuch.Orderly.domain.restaurant.mapper;

import com.chuch.Orderly.domain.restaurant.dto.CreateTableRequest;
import com.chuch.Orderly.domain.restaurant.dto.TableResponse;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.entity.RestaurantTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TableMapper {

    @Mapping(target = "restaurantId", source = "restaurant.id")
    TableResponse toResponse(RestaurantTable table);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", source = "restaurant")
    @Mapping(target = "tableNumber", source = "request.tableNumber")
    @Mapping(target = "qrCodeToken", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    RestaurantTable toEntity(CreateTableRequest request, Restaurant restaurant);
}
