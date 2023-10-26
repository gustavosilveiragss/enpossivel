-- Active: 1698186000660@@127.0.0.1@3306@enpossivel
-- Sample data for the User table
INSERT INTO account (name, email, password, role) VALUES
    ('John Doe', 'john.doe@example.com', 'hashed_password', 'account'),
    ('Jane Smith', 'jane.smith@example.com', 'hashed_password', 'admin'),
    (null, null, null, 'anon');

-- Sample data for the Product table
INSERT INTO product (title, price, img_path) VALUES
    ('Product A', 29.99, '/images/product_a.jpg'),
    ('Product B', 39.99, '/images/product_b.jpg');

-- Sample data for the Cart table
INSERT INTO cart (account_id) VALUES
    (1),
    (2);

-- Sample data for the Cart_Item table
INSERT INTO cart_item (cart_id, product_id) VALUES
    (1, 1),
    (2, 2);

-- Sample data for the Payment_Method table
INSERT INTO payment_method (name) VALUES
    ('Credit Card'),
    ('Debit Card');

-- Sample data for the Order table
INSERT INTO `order`(account_id) VALUES
    (1),
    (2);

-- Sample data for the Order_Item table
INSERT INTO order_item (order_id, product_id) VALUES
    (1, 1),
    (2, 2);
