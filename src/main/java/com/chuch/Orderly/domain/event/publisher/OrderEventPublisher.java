package com.chuch.Orderly.domain.event.publisher;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.order}")
    private String orderExchange;

    @Value("${rabbitmq.routing-key.order-created}")
    private String orderCreatedRoutingKey;

    @Value("${rabbitmq.routing-key.order-status-changed}")
    private String orderStatusChangedRoutingKey;

    public void publishOrderCreated(OrderCreatedEvent event) {
        try {
            rabbitTemplate.convertAndSend(orderExchange, orderCreatedRoutingKey, event);
            log.info("Published OrderCreatedEvent for order {} to restaurant {}",
                    event.getOrderId(), event.getRestaurantId());
        } catch (Exception e) {
            log.error("Failed to publish OrderCreatedEvent for order {}", event.getOrderId(), e);
            throw new RuntimeException("Failed to publish order created event", e);
        }
    }

    public void publishOrderStatusChanged(OrderStatusChangedEvent event) {
        try {
            rabbitTemplate.convertAndSend(orderExchange, orderStatusChangedRoutingKey, event);
            log.info("Published OrderStatusChangedEvent for order {} - {} -> {}",
                    event.getOrderId(), event.getOldStatus(), event.getNewStatus());
        } catch (Exception e) {
            log.error("Failed to publish OrderStatusChangedEvent for order {}", event.getOrderId(), e);
            throw new RuntimeException("Failed to publish order status changed event", e);
        }
    }
}
