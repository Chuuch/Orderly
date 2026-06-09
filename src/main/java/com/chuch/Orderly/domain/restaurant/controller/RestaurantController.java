package com.chuch.Orderly.domain.restaurant.controller;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.dto.RestaurantResponse;
import com.chuch.Orderly.domain.restaurant.dto.UpdateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.mapper.RestaurantMapper;
import com.chuch.Orderly.domain.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Slf4j
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        log.info("Получена HTTP POST заявка за създаване на ресторант със субдомейн: {}", request.subdomain());

        Restaurant createdRestaurant = restaurantService.createRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurant(@PathVariable UUID id) {
        Restaurant restaurant = restaurantService.getRestaurant(id);
        return ResponseEntity.ok(restaurantMapper.toResponse(restaurant));
    }

    @GetMapping("/subdomain/{subdomain}")
    public ResponseEntity<RestaurantResponse> getRestaurantBySubdomain(@PathVariable String subdomain) {
        Restaurant restaurant = restaurantService.getRestaurantBySubdomain(subdomain);
        return ResponseEntity.ok(restaurantMapper.toResponse(restaurant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant( @PathVariable UUID id, @Valid @RequestBody UpdateRestaurantRequest request) {
        log.info("Получена HTTP PUT заявка за обновяване на ресторант с ID: {}", id);
        Restaurant updated = restaurantService.updateRestaurant(id, request);
        return ResponseEntity.ok(updated);
    }
}
