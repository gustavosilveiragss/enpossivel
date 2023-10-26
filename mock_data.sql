-- Sample data for the User table
INSERT INTO account (created_at, name, email, password, role) VALUES
    ('2023-10-25 09:00:00', 'John Doe', 'john.doe@example.com', 'hashed_password', 'account'),
    ('2023-10-25 10:30:00', 'Jane Smith', 'jane.smith@example.com', 'hashed_password', 'admin'),
    ('2023-10-25 11:30:00', null, null, null, 'anon');

-- Sample data for the Product table
INSERT INTO product (created_at, title, price, img_path) VALUES
    ('2023-10-25 08:45:00', 'Product A', 29.99, '/images/product_a.jpg'),
    ('2023-10-25 09:15:00', 'Product B', 39.99, '/images/product_b.jpg');

-- Sample data for the Cart table
INSERT INTO cart (created_at, account_id) VALUES
    ('2023-10-25 10:00:00', 1),
    ('2023-10-25 11:30:00', 2);

-- Sample data for the Cart_Item table
INSERT INTO cart_item (created_at, cart_id, product_id, quantity) VALUES
    ('2023-10-25 10:15:00', 1, 1, 2),
    ('2023-10-25 10:30:00', 2, 2, 1);

-- Sample data for the Payment_Method table
INSERT INTO payment_method (created_at, name) VALUES
    ('2023-10-25 09:30:00', 'Credit Card'),
    ('2023-10-25 09:45:00', 'Debit Card');

-- Sample data for the Order table
INSERT INTO `order`(created_at, account_id) VALUES
    ('2023-10-25 11:00:00', 1),
    ('2023-10-25 12:30:00', 2);

-- Sample data for the Order_Item table
INSERT INTO order_item (created_at, order_id, product_id, quantity) VALUES
    ('2023-10-25 11:15:00', 1, 1, 2),
    ('2023-10-25 11:30:00', 2, 2, 1);
