INSERT INTO restaurants (id, name, subdomain, address, phone_number, is_active)
VALUES (
    'cba01ab3-c48e-44cc-9dc8-57d8ece8e01d',
    'Happy Haskovo',
    'happy-haskovo-test',
    'Test address',
    '0888123456',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO tables (id, restaurant_id, table_number, qr_code_token, status)
VALUES (
    '11ea82d1-f7c9-4255-bafa-ad6d606f2caf',
    'cba01ab3-c48e-44cc-9dc8-57d8ece8e01d',
    '1',
    'd656853e-d0df-47a3-873b-b42511fbbea3',
    'AVAILABLE'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO menus (id, restaurant_id, name, description, is_active)
VALUES (
    '60624d55-58b0-4c09-b510-78a44aa0fead',
    'cba01ab3-c48e-44cc-9dc8-57d8ece8e01d',
    'Lunch Menu',
    'Main menu',
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, menu_id, name, description, price, preparation_time_minutes, is_available, is_vegetarian, is_spicy)
VALUES (
    '201e1da9-2a01-44b2-a297-3abf074e5ffa',
    '60624d55-58b0-4c09-b510-78a44aa0fead',
    'Margherita',
    'Tomato, mozzarella, basil',
    12.50,
    15,
    true,
    true,
    false
) ON CONFLICT (id) DO NOTHING;
