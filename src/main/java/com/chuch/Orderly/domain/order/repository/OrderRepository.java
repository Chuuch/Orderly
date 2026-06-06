package com.chuch.Orderly.domain.order.repository;

import com.chuch.Orderly.domain.order.entity.Order;
import com.chuch.Orderly.domain.order.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findByRestaurantId(UUID restaurantId, Pageable pageable);
    List<Order> findByRestaurantTableIdAndStatus(UUID restaurantTableId, OrderStatus status);
    Page<Order> findByRestaurantIdAndStatus(UUID restaurantId, OrderStatus status, Pageable pageable);
    List<Order> findByRestaurantIdAndCreatedAtAfter(UUID restaurantId, LocalDateTime createdAt);
}
