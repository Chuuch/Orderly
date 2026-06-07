package com.chuch.Orderly.domain.kitchen.service;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import com.chuch.Orderly.domain.kitchen.dto.KitchenWebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class KitchenNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyOrderCreated(OrderCreatedEvent event) {
        send(event.getRestaurantId(), KitchenWebSocketMessage.builder()
                .type("ORDER_CREATED")
                .payload(event)
                .build());
    }

    public void notifyOrderStatusChanged(OrderStatusChangedEvent event) {
        send(event.getRestaurantId(), KitchenWebSocketMessage.builder()
                .type("ORDER_STATUS_CHANGED")
                .payload(event)
                .build());
    }

    private void send(UUID restaurantId, KitchenWebSocketMessage message) {
        String destination = "/topic/restaurant/" + restaurantId + "/kitchen";
        messagingTemplate.convertAndSend(destination, message);
        log.info("Sent WebSocket message {} to {}", message.getType(), destination);
    }
}
