package com.chuch.Orderly.domain.restaurant.mapper;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.dto.RestaurantResponse;
import com.chuch.Orderly.domain.restaurant.dto.UpdateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tables", ignore = true)
    Restaurant toEntity(CreateRestaurantRequest request);

    @Mapping(target ="active", source = "active")
    RestaurantResponse toResponse(Restaurant restaurant);

    void updateEntityFromDto(UpdateRestaurantRequest dto, @MappingTarget Restaurant entity);
}
