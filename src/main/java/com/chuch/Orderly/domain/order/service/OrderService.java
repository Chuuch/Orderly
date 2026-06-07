package com.chuch.Orderly.domain.order.service;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import com.chuch.Orderly.domain.event.publisher.OrderEventPublisher;
import com.chuch.Orderly.domain.menu.entity.MenuItem;
import com.chuch.Orderly.domain.menu.repository.MenuItemRepository;
import com.chuch.Orderly.domain.order.dto.CreateOrderRequest;
import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.order.entity.Order;
import com.chuch.Orderly.domain.order.entity.OrderItem;
import com.chuch.Orderly.domain.order.enums.OrderStatus;
import com.chuch.Orderly.domain.order.mapper.OrderMapper;
import com.chuch.Orderly.domain.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderMapper orderMapper;
    private final OrderEventPublisher orderEventPublisher;

    public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {
        Order order = Order.builder()
                .restaurantId(request.getRestaurantId())
                .restaurantTableId(request.getRestaurantTableId())
                .userId(userId)
                .status(OrderStatus.PENDING)
                .specialInstructions(request.getSpecialInstructions())
                .build();

        for (var itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemRequest.getMenuItemId()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .specialInstructions(itemRequest.getSpecialInstructions())
                    .build();
            order.addItem(orderItem);
        }
        order.calculateTotal();
        Order savedOrder = orderRepository.save(order);
        log.info("Created order {} with {} items for restaurant {}",
                savedOrder.getId(), savedOrder.getItems().size(), request.getRestaurantId());
        publishOrderCreatedEvent(savedOrder);
        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getRestaurantOrders(UUID restaurantId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByRestaurantId(restaurantId, pageable);
        return orders.map(orderMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getPendingOrdersForTable(UUID restaurantTableId) {
        List<Order> orders = orderRepository.findByRestaurantTableIdAndStatus(
                restaurantTableId, OrderStatus.PENDING
        );
        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByStatus(UUID restaurantId, OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByRestaurantIdAndStatus(restaurantId, status, pageable);
        return orders.map(orderMapper::toResponse);
    }

    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.READY) {
            Integer maxPrepTime = order.getItems().stream()
                    .map(item -> item.getMenuItem().getPreparationTimeMinutes())
                    .max(Integer::compareTo)
                    .orElse(15);
            order.setEstimatedReadyTime(LocalDateTime.now().plusMinutes(maxPrepTime));
        }

        if (newStatus == OrderStatus.PAID) {
            order.setCompletedAt(LocalDateTime.now());
        }

        Order updatedOrder = orderRepository.save(order);
        log.info("Updated order {} status from {} to {}", orderId, oldStatus, newStatus);

        publishOrderStatusChangedEvent(updatedOrder, oldStatus, newStatus);
        return orderMapper.toResponse(updatedOrder);
    }

    public OrderResponse cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PREPARING ||
            order.getStatus() == OrderStatus.READY ||
            order.getStatus() == OrderStatus.SERVED
        )   {
            throw new IllegalStateException("Cannot cancel order in status: " + order.getStatus());
        }

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        log.info("Cancelled order {}", orderId);

        publishOrderStatusChangedEvent(updatedOrder, oldStatus, OrderStatus.CANCELLED);
        return orderMapper.toResponse(updatedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentOrders(UUID restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantIdAndCreatedAtAfter(
                restaurantId, LocalDateTime.now().minusHours(24)
        );
        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ============= Event Publishing ============== //
    private void publishOrderCreatedEvent(Order order) {
        List<OrderCreatedEvent.OrderItemEventDto> eventItems = order.getItems().stream()
                .map(item -> new OrderCreatedEvent.OrderItemEventDto(
                        item.getMenuItem().getId(),
                        item.getMenuItem().getName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getSpecialInstructions()
                ))
                .toList();

        OrderCreatedEvent event = new OrderCreatedEvent(
                order.getRestaurantId(),
                order.getId(),
                order.getRestaurantTableId(),
                order.getUserId(),
                order.getTotalAmount(),
                eventItems,
                order.getSpecialInstructions()
        );
        orderEventPublisher.publishOrderCreated(event);
    }

    private void publishOrderStatusChangedEvent(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        OrderStatusChangedEvent event = new OrderStatusChangedEvent(
                order.getRestaurantId(),
                order.getId(),
                order.getRestaurantTableId(),
                oldStatus,
                newStatus,
                order.getUserId()
        );

        orderEventPublisher.publishOrderStatusChanged(event);
    }
}
