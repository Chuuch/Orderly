package com.chuch.Orderly.domain.event.audit;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderAuditService {

    private final OrderAuditRepository repository;
    private final JsonMapper jsonMapper;

    @Transactional
    public void logOrderCreated(OrderCreatedEvent event) {
        save(
                event.getEventId(),
                event.getEventType(),
                event.getRestaurantId(),
                event.getOrderId(),
                null,
                null,
                event
        );
    }

    @Transactional
    public void logOrderStatusChanged(OrderStatusChangedEvent event) {
        save(
                event.getEventId(),
                event.getEventType(),
                event.getRestaurantId(),
                event.getOrderId(),
                event.getOldStatus() != null ? event.getOldStatus().name() : null,
                event.getNewStatus() != null ? event.getNewStatus().name() : null,
                event
        );
    }

    private void save(
            UUID eventId,
            String eventType,
            UUID restaurantId,
            UUID orderId,
            String oldStatus,
            String newstatus,
            Object payloadObject
    ) {
        try {
            OrderAuditEvent auditEvent = OrderAuditEvent.builder()
                    .eventId(eventId)
                    .eventType(eventType)
                    .restaurantId(restaurantId)
                    .orderId(orderId)
                    .oldStatus(oldStatus)
                    .newStatus(newstatus)
                    .payload(jsonMapper.writeValueAsString(payloadObject))
                    .createdAt(LocalDateTime.now())
                    .build();
            repository.save(auditEvent);
        } catch (JacksonException e) {
            log.error("Failed to serialize audit payload for order {}", orderId, e);
            throw new IllegalStateException("Failed to persist audit event", e);
        }
    }
}
