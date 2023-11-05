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
        img_path VARCHAR(255) NULL,
        stock INT NOT NULL DEFAULT 1,
        active BOOLEAN NOT NULL DEFAULT TRUE
    );

CREATE TABLE
    cart (
        cart_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id)
    );

CREATE TABLE
    cart_product (
        cart_product_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
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

INSERT INTO
    payment_method (name)
VALUES ('pix'), ('debit'), ('credit');

CREATE TABLE
    card (
        card_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        account_id INT NOT NULL,
        card_owner_name VARCHAR(255) NOT NULL,
        card_number VARCHAR(19) NOT NULL,
        card_expiration_date DATE NOT NULL,
        card_cvv VARCHAR(3) NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id)
    );

CREATE TABLE
    `order` (
        order_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        account_id INT NOT NULL,
        cpf VARCHAR(14) NOT NULL DEFAULT "",
        payment_method_id INT NULL,
        card_id INT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id),
        FOREIGN KEY (payment_method_id) REFERENCES payment_method(payment_method_id),
        FOREIGN KEY (card_id) REFERENCES card(card_id)
    );

CREATE TABLE
    order_product (
        order_product_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES `order`(order_id),
        FOREIGN KEY (product_id) REFERENCES product(product_id)
    );

SELECT * FROM `order`;
