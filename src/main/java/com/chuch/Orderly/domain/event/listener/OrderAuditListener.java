package com.chuch.Orderly.domain.event.listener;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderAuditListener {

    @RabbitListener(queues = "${rabbitmq.queue.audit-order-created}")
    public void auditOrderCreated(OrderCreatedEvent event) {
        try {
            log.info("AUDIT: Order created at {}", event.getTimestamp());
            log.info("AUDIT: Restaurant: {}, Order ID: {}, User: {}, Total: {}",
                    event.getRestaurantId(), event.getOrderId(), event.getUserId(), event.getTotalAmount());
            log.info("AUDIT: Items: {}", event.getItems().size());

            // In production save to audit table or external logging system
            // auditService.logOrderCreated(event);
        } catch (Exception e) {
            log.error("Error auditing OrderCreatedEvent", e);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.audit-order-status-changed}")
    public void auditOrderStatusChanged(OrderStatusChangedEvent event) {
        try {
            log.info("AUDIT: Order status changed at {}", event.getTimestamp());
            log.info("AUDIT: Order ID: {}, Status: {} -> {}, Changed by: {}",
                    event.getOrderId(), event.getOldStatus(), event.getNewStatus(), event.getChangedBy());

            // In production, save to audit table
            // auditService.logOrderStatusChanged(event);
        } catch (Exception e) {
            log.error("Error auditing OrderStatusChangedEvent", e);
        }
    }
}
