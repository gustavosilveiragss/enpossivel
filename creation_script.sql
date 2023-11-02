-- Active: 1698186000660@@127.0.0.1@3306@enpossivel

CREATE TABLE
    account (
        account_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        password VARCHAR(255) NULL,
        role ENUM('user', 'admin', 'anon') DEFAULT 'anon'
    );

CREATE TABLE
    product (
        product_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        img_path VARCHAR(255) NULL
    );

CREATE TABLE
    cart (
        cart_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id)
    );

CREATE TABLE
    cart_item (
        cart_item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
        FOREIGN KEY (product_id) REFERENCES product(product_id)
    );

CREATE TABLE
    payment_method (
        payment_method_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255) NOT NULL
    );

CREATE TABLE
    `order` (
        order_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id)
    );

CREATE TABLE
    order_item (
        order_item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES `order`(order_id),
        FOREIGN KEY (product_id) REFERENCES product(product_id)
    );

CREATE TABLE
    payment (
        payment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_id INT NOT NULL,
        amount_payed DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES `order`(order_id),
    )

CREATE TABLE
    payment_instalment (
        payment_instalment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        payment_id INT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
    )
