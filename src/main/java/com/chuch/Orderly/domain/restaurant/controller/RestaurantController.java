package com.chuch.Orderly.domain.restaurant.controller;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Slf4j
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        log.info("Получена HTTP POST заявка за създаване на ресторант със субдомейн: {}", request.subdomain());

        Restaurant createdRestaurant = restaurantService.createRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }
}
