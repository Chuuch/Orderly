package com.chuch.Orderly.domain.event.listener;

import com.chuch.Orderly.domain.event.event.OrderCreatedEvent;
import com.chuch.Orderly.domain.event.event.OrderStatusChangedEvent;
import com.chuch.Orderly.domain.kitchen.service.KitchenNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KitchenEventListener {

    private final KitchenNotificationService kitchenNotificationService;

    @RabbitListener(queues = "${rabbitmq.queue.order-created}")
    public void onOrderCreated(OrderCreatedEvent event) {
        try {
            log.info("Kitchen received new order {} for table {} - Restaurant: {}",
                    event.getOrderId(), event.getTableId(), event.getRestaurantId());

            event.getItems().forEach(item ->
                    log.info(" - {} x {} (prep time: TBD)", item.getMenuItemName(), item.getQuantity()));

            if (event.getSpecialInstructions() != null && !event.getSpecialInstructions().isEmpty()) {
                log.info(" Special instructions: {}", event.getSpecialInstructions());
            }
            kitchenNotificationService.notifyOrderCreated(event);
        } catch (Exception e) {
            log.error("Error processing OrderCreatedEvent for order {}", event.getOrderId(), e);
            throw new RuntimeException("Failed to process order created event", e);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.order-status-changed}")
    public void onOrderStatusChanged(OrderStatusChangedEvent event) {
        try {
            log.info("Order {} status updated: {} -> {} (Kitchen: {})",
                    event.getOrderId(), event.getOldStatus(), event.getNewStatus(), event.getRestaurantId());

            switch (event.getNewStatus()) {
                case CONFIRMED:
                    log.info("Order {} confirmed - Kitchen can start preparation", event.getOrderId());
                    // notifyKitchenOrderConfimed(event);
                    break;
                case PREPARING:
                    log.info("Order {} is now being prepared", event.getOrderId());
                    // updateKitchenDisplay(event);
                    break;
                case READY:
                    log.info("Order {} is ready for pickup from table {}", event.getOrderId(), event.getTableId());
                    // notifyWaiterOrderReady(event);
                    break;
                case SERVED:
                    log.info("Order {} has been served to table {}", event.getOrderId(), event.getTableId());
                    // updateOrderMetrics(event);
                    break;
                case PAID:
                    log.info("Order {} payment completed", event.getOrderId());
                    // archiveOrder(event);
                    break;
                case CANCELLED:
                    log.info("Order {} has been cancelled", event.getOrderId());
                    // notifyKitchenOrderCancelled(event);
                    break;
                default:
                    log.debug("Order {} status changed to: {}", event.getOrderId(), event.getNewStatus());
            }
            kitchenNotificationService.notifyOrderStatusChanged(event);
        } catch (Exception e) {
            log.error("Error processing OrderStatusChangedEvent for order {}", event.getOrderId(), e);
            throw new RuntimeException("Failed to process order status changed event", e);
        }
    }
}
