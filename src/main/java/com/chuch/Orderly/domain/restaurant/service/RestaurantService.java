package com.chuch.Orderly.domain.restaurant.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.dto.UpdateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.mapper.RestaurantMapper;
import com.chuch.Orderly.domain.restaurant.repository.RestaurantRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Transactional
    public Restaurant createRestaurant(CreateRestaurantRequest request) {
        log.info("Създаване на нов ресторант: име [{}], субдомейн [{}]", request.name(), request.subdomain());

        if (restaurantRepository.findBySubdomain(request.subdomain()).isPresent()) {
            log.warn("Грешка при създаване: Субдомейнът [{}] вече е зает!", request.subdomain());
            throw new IllegalArgumentException("Този субдомейн вече се използва от друг ресторант.");
        }

        Restaurant restaurant = restaurantMapper.toEntity(request);

        restaurant.setSubdomain(restaurant.getSubdomain().toLowerCase().trim());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        log.info("Успешно създаден ресторант [{}] с генерирано ID: {}", savedRestaurant, savedRestaurant.getId());
        return savedRestaurant;
    }

    @Transactional
    public Restaurant getRestaurant(UUID id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found: " + id));
    }

    @Transactional
    public Restaurant getRestaurantBySubdomain(String subdomain) {
        return restaurantRepository.findBySubdomain(subdomain)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found: " + subdomain));
    }

    @Transactional
    public Restaurant updateRestaurant(UUID id, UpdateRestaurantRequest request) {
        log.info("Обновяване на ресторант с ID: {}", id);

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ресторант с това ID не беше намерен."));

        restaurantMapper.updateEntityFromDto(request, restaurant);

        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        log.info("Ресторантът [{}] беше обновен успешно.", updatedRestaurant.getName());
        return updatedRestaurant;
    }
}
