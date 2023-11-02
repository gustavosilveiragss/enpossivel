-- Active: 1698186000660@@127.0.0.1@3306@enpossivel

-- Sample data for the User table

INSERT INTO
    account (name, email, password, role)
VALUES (
        'John Doe',
        'john.doe@example.com',
        'hashed_password',
        'user'
    ), (
        'Jane Smith',
        'jane.smith@example.com',
        'hashed_password',
        'admin'
    ), (null, null, null, 'anon');

-- Sample data for the Product table

INSERT INTO
    product (title, price, img_path)
VALUES (
        'Product A',
        29.99,
        '/res/images/img.png'
    ), (
        'Product B',
        39.99,
        '/res/images/_42dfff0d-10bb-4d6f-ba2b-e62939034c64.jpeg'
    );

-- Sample data for the Cart table

INSERT INTO cart (account_id) VALUES (1), (2);

-- Sample data for the cart_product table

INSERT INTO
    cart_product (cart_id, product_id)
VALUES (1, 1), (2, 2);

-- Sample data for the Payment_Method table

INSERT INTO
    payment_method (name)
VALUES ('Credit Card'), ('Debit Card');
