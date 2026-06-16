package com.chuch.Orderly.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chuch.Orderly.domain.restaurant.dto.CreateRestaurantRequest;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.service.RestaurantService;
import com.chuch.Orderly.domain.user.dto.AuthResponse;
import com.chuch.Orderly.domain.user.dto.OnboardingRequest;
import com.chuch.Orderly.domain.user.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OnboardingService {
    
    private final RestaurantService restaurantService;
    private final AuthService authService;

    @Transactional
    public AuthResponse onboard(OnboardingRequest request) {
        Restaurant restaurant = restaurantService.createRestaurant(
            new CreateRestaurantRequest(
                request.restaurantName(),
                request.subdomain(),
                request.address(),
                request.phoneNumber()
            )
        );

        return authService.register(new RegisterRequest(
            request.firstName(),
            request.lastName(),
            request.email(),
            request.password(),
            restaurant.getId()
        ));
    }
}
