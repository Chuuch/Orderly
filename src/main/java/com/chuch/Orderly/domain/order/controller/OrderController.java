package com.chuch.Orderly.domain.order.controller;

import com.chuch.Orderly.domain.order.dto.CreateOrderRequest;
import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.order.enums.OrderStatus;
import com.chuch.Orderly.domain.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    /**
     * Creates a new order
     * @param request - DTO object
     * @param authentication - represents the token for an authentication request
     * @return - returns an OrderResponse DTO object
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('WAITER', 'CUSTOMER')")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication
            ) {
        UUID userId = UUID.fromString(authentication.getName());
        OrderResponse response = orderService.createOrder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    /**
     * Gets an order by its id
     * @param orderId - the id of the order we look for
     * @return - returns an OrderResponse DTO
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER', 'CUSTOMER')")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID orderId) {
        OrderResponse response = orderService.getOrder(orderId);
        return ResponseEntity.ok(response);
    }


    /**
     * Get all orders for a restaurant with pagination
     * @param restaurantId - id of restaurant we look for
     * @param pageable - pagination parameter
     * @return - returns a Page object of the OrderResponse DTO
     */
    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF')")
    public ResponseEntity<Page<OrderResponse>> getRestaurantOrders(
            @PathVariable UUID restaurantId,
            Pageable pageable
    ) {
        Page<OrderResponse> orders = orderService.getRestaurantOrders(restaurantId, pageable);
        return ResponseEntity.ok(orders);
    }


    /**
     * Gets all pending orders for a table by its id
     * @param tableId - id of the table we look for
     * @return - returns a list of OrderResponse DTO
     */
    @GetMapping("/table/{tableId}/pending")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER')")
    public ResponseEntity<List<OrderResponse>> getPendingOrdersForTable(@PathVariable UUID tableId) {
        List<OrderResponse> orders = orderService.getPendingOrdersForTable(tableId);
        return ResponseEntity.ok(orders);
    }


    /**
     * Get orders by status
     * @param restaurantId - id or restaurant we look for
     * @param status - status we get orders by
     * @param pageable - page parameters
     * @return - returns a Page object of OrderResponse DTO
     */
    @GetMapping("/restaurant/{restaurantId}/status/{status}")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF')")
    public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
            @PathVariable UUID restaurantId,
            @PathVariable OrderStatus status,
            Pageable pageable
    ) {
        Page<OrderResponse> orders = orderService.getOrdersByStatus(restaurantId, status, pageable);
        return ResponseEntity.ok(orders);
    }


    /**
     * Update Order status
     * @param orderId - id of order we update
     * @param status - status we update order to
     * @return - returns OrderResponse DTO
     */
    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status
    ) {
        OrderResponse response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }


    /**
     * Cancel an order
     * @param orderId - id of order we cancel
     * @return - returns an OrderResponse DTO
     */
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'CUSTOMER')")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable UUID orderId) {
        OrderResponse response = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(response);
    }


    /**
     * Get recent orders for a restaurant
     * @param restaurantId - id of restaurant we look for
     * @return - returns a list of OrderResponse DTO
     */
    @GetMapping("/restaurant/{restaurantId}/recent")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF')")
    public ResponseEntity<List<OrderResponse>> getRecentOrders(@PathVariable UUID restaurantId) {
        List<OrderResponse> orders = orderService.getRecentOrders(restaurantId);
        return ResponseEntity.ok(orders);
    }
}
