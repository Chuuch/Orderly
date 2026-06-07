package com.chuch.Orderly.global.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.order}")
    private String orderExchange;

    @Value("${rabbitmq.exchange.kitchen}")
    private String kitchenExchange;

    @Value("${rabbitmq.queue.order-created}")
    private String orderCreatedQueue;

    @Value("${rabbitmq.queue.order-status-changed}")
    private String orderStatusChangedQueue;

    @Value("${rabbitmq.queue.audit-order-created}")
    private String auditOrderCreatedQueue;

    @Value("${rabbitmq.queue.audit-order-status-changed}")
    private String auditOrderStatusChangedQueue;

    @Value("${rabbitmq.queue.kitchen-orders}")
    private String kitchenOrdersQueue;

    @Value("${rabbitmq.routing-key.order-created}")
    private String orderCreatedRoutingKey;

    @Value("${rabbitmq.routing-key.order-status-changed}")
    private String orderStatusChangedRoutingKey;

    @Value("${rabbitmq.routing-key.kitchen-order}")
    private String kitchenOrderRoutingKey;

    // ================== Order Exchange ======================
    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(orderExchange, true, false);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(orderCreatedQueue)
                .withArgument("x-message-ttl", 86400000)
                .build(); // 24 hours ttl
    }

    @Bean
    public Queue orderStatusChangedQueue() {
        return QueueBuilder.durable(orderStatusChangedQueue)
                .withArgument("x-message-ttl", 86400000)
                .build(); // 24 hours ttl
    }

    @Bean
    public Binding orderCreatedBinding(Queue orderCreatedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderCreatedQueue)
                .to(orderExchange)
                .with(orderCreatedRoutingKey);
    }

    @Bean
    public Binding orderStatusChangedBinding(Queue orderStatusChangedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderStatusChangedQueue)
                .to(orderExchange)
                .with(orderStatusChangedRoutingKey);
    }

    @Bean
    public Queue auditOrderCreatedQueue() {
        return QueueBuilder.durable(auditOrderCreatedQueue)
                .withArgument("x-message-ttl", 86400000)
                .build();
    }

    @Bean
    public Queue auditOrderStatusChangedQueue() {
        return QueueBuilder.durable(auditOrderStatusChangedQueue)
                .withArgument("x-message-ttl", 86400000)
                .build();
    }

    @Bean
    public Binding auditOrderCreatedBinding(Queue auditOrderCreatedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(auditOrderCreatedQueue)
                .to(orderExchange)
                .with(orderCreatedRoutingKey);
    }

    @Bean
    public Binding auditOrderStatusChangedBinding(Queue auditOrderStatusChangedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(auditOrderStatusChangedQueue)
                .to(orderExchange)
                .with(orderStatusChangedRoutingKey);
    }

    // ================ Kitchen Exchange ==================
    @Bean
    public TopicExchange kitchenExchange() {
        return new TopicExchange(kitchenExchange, true, false);
    }

    @Bean
    public Queue kitchenOrdersQueue() {
        return QueueBuilder.durable(kitchenOrdersQueue)
                .withArgument("x-message-ttl", 86400000) // 24 hours ttl
                .build();
    }

    @Bean
    public Binding kitchenOrderBinding(Queue kitchenOrdersQueue, TopicExchange kitchenExchange) {
        return BindingBuilder.bind(kitchenOrdersQueue)
                .to(kitchenExchange)
                .with(kitchenOrderRoutingKey);
    }

    // =============== Message Converter =================
    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
