-- Active: 1698186000660@@127.0.0.1@3306@enpossivel

INSERT INTO
    account (name, email, password, role)
VALUES (
        'admin',
        'admin@admin.com',
        'admin',
        'admin'
    );

INSERT INTO cart (account_id) VALUES (1);

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

-- Sample data for the Payment_Method table

INSERT INTO
    payment_method (name)
VALUES ('Credit Card'), ('Debit Card');
