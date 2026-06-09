package com.chuch.Orderly.domain.restaurant.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RestaurantResponse {
    private UUID id;
    private String name;
    private String subdomain;
    private String address;
    private String phoneNumber;
    private boolean active;
}
