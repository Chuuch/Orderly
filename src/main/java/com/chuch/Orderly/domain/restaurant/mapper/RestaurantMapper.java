package com.chuch.Orderly.domain.restaurant.mapper;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tables", ignore = true)
    Restaurant toEntity(CreateRestaurantRequest request);
}
