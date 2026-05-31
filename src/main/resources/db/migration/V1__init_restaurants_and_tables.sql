CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

       CREATE TABLE restaurants (
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           name VARCHAR(100) NOT NULL,
           subdomain VARCHAR(50) NOT NULL UNIQUE,
           address VARCHAR(255),
           phone_number VARCHAR(20),
           is_active BOOLEAN NOT NULL DEFAULT TRUE,
           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
       );

CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    table_number VARCHAR(10) NOT NULL,
    qr_code_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_table_restaurant
                    FOREIGN KEY (restaurant_id)
                    REFERENCES restaurants(id)
                    ON DELETE CASCADE,
    CONSTRAINT uq_restaurant_table_number
                    UNIQUE (restaurant_id, table_number)
);