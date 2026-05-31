package com.chuch.Orderly.domain.restaurant.repository;

import com.chuch.Orderly.domain.restaurant.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, UUID> {
    // Get all tables for a specific restaurant
    List<RestaurantTable> findByRestaurantId(UUID restaurantId);
    // Get the table when the client scans the QR code
    Optional<RestaurantTable> findByQrCodeToken(UUID qrCodeToken);
}
