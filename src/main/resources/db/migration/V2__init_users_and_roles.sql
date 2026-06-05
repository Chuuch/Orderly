-- Create roles table

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_type VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Insert default roles
INSERT INTO roles (role_type, description) VALUES
    ('RESTAURANT_ADMIN', 'Full access to restaurant management'),
    ('KITCHEN_STAFF', 'Access to kitchen display system'),
    ('WAITER', 'Can manage orders and customer requests'),
    ('CUSTOMER', 'Can place orders as guest');

-- Create users table (multi-tenant aware)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    restaurant_id UUID NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_user_restaurant
                   FOREIGN KEY (restaurant_id)
                   REFERENCES restaurants(id)
                   ON DELETE CASCADE,
    CONSTRAINT uq_user_email_restaurant
                   UNIQUE (email, restaurant_id)
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
                        FOREIGN KEY (user_id)
                        REFERENCES users(id)
                        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_roles
                        FOREIGN KEY (role_id)
                        REFERENCES roles(id)
                        ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX idx_users_roles_user_id ON user_roles(user_id);