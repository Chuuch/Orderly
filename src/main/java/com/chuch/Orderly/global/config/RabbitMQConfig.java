package com.chuch.Orderly.global.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.JacksonJsonMessageConverter;

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

    // =============== Message Template =================
    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(RabbitTemplate template) {
        template.setMessageConverter((MessageConverter) messageConverter());
        return template;
    }
}
