-- Create event audit log table for tracking all order events
CREATE TABLE order_audit_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    restaurant_id UUID NOT NULL,
    order_id UUID NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_audit_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_audit_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create indexes for audit queries
CREATE INDEX idx_event_audit_event_type ON order_audit_event(event_type);
CREATE INDEX idx_event_audit_order_id ON order_audit_event(order_id);
CREATE INDEX idx_event_audit_restaurant_id ON order_audit_event(restaurant_id);
CREATE INDEX idx_event_audit_created_at ON order_audit_event(created_at);