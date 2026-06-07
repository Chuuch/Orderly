package com.chuch.Orderly.domain.event.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class DomainEvent implements Serializable {

    @JsonProperty("event_id")
    protected UUID eventId;

    @JsonProperty("event_type")
    protected String eventType;

    @JsonProperty("timestamp")
    protected LocalDateTime timestamp;

    @JsonProperty("restaurant_id")
    protected UUID restaurantId;

    @JsonProperty("aggregate_id")
    protected UUID aggregateId;

    public DomainEvent(UUID restaurantId, UUID aggregateId) {
        this.eventId = UUID.randomUUID();
        this.eventType = this.getClass().getSimpleName();
        this.timestamp = LocalDateTime.now();
        this.restaurantId = restaurantId;
        this.aggregateId = aggregateId;
    }
}
