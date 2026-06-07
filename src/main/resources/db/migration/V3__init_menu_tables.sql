-- Create manus table
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_menu_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT unique_restaurant_menu_name UNIQUE (restaurant_id, name)
);

-- Create indexes for menus
CREATE INDEX idx_menu_restaurant_id ON menus(restaurant_id);
CREATE INDEX idx_menu_is_active ON menus(is_active);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(19, 2) NOT NULL,
  preparation_time_minutes INTEGER NOT NULL DEFAULT 15,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_vegetarian BOOLEAN NOT NULL DEFAULT false,
  is_spicy BOOLEAN NOT NULL DEFAULT false,
  allergens VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_item_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  CONSTRAINT unique_menu_item_name UNIQUE (menu_id, name),
  CONSTRAINT check_price_positive CHECK (price > 0),
  CONSTRAINT check_prep_time_positive CHECK (preparation_time_minutes > 0)
);

-- Create indexes for menu_items
CREATE INDEX idx_menu_item_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_item_is_available ON menu_items(is_available);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    restaurant_table_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(19, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(19, 2),
    discount_amount NUMERIC(19, 2),
    special_instructions TEXT,
    estimated_ready_time TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_table FOREIGN KEY (restaurant_table_id) REFERENCES tables(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for orders
CREATE INDEX idx_order_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_order_table_id ON orders(restaurant_table_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created_at ON orders(created_at);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    menu_item_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(19, 2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
    CONSTRAINT check_quality_positive CHECK (quantity > 0),
    CONSTRAINT check_unit_price_positive CHECK (unit_price > 0)
);

-- Create indexes for order_items
CREATE INDEX idx_order_item_order_id ON order_items(order_id);
CREATE INDEX idx_order_item_menu_item_id ON order_items(menu_item_id);