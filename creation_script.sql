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
        status ENUM(
            'incompleto',
            'finalizado'
        ) DEFAULT 'incompleto',
        payment_method ENUM(
            'pix',
            'debit',
            'credit'
        ) NULL DEFAULT NULL,
        card_id INT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (account_id) REFERENCES account(account_id),
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

CREATE TABLE
    payment (
        payment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_id INT NOT NULL,
        amount_payed DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES `order`(order_id)
    );

CREATE TABLE
    payment_instalment (
        payment_instalment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        payment_id INT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
    );

INSERT INTO
    account (name, email, password, role)
VALUES (
        'admin',
        'admin@admin.com',
        'admin',
        'admin'
    );

INSERT INTO cart (account_id) VALUES (1);


INSERT INTO
    product (title, price, img_path, stock)
VALUES
    (
        'Baú de Maquiagens do Cthulu',
        75.00,
        '/res/images/cthulhu_chest.jpeg',
        1
    ),
    (
        'Globo Ocular de Ciclope Mágico',
        300.00,
        '/res/images/globe.jpeg',
        3
    ),
    (
        'Planta Lunar Medicinal (Do Bom)',
        150.00,
        '/res/images/moonplant.jpeg',
        15
    ),
    (
        'Gato Preso em uma Lâmpada',
        5,
        '/res/images/pixar_cat.jpeg',
        1
    ),
    (
        'Fibra da Dimensão Temporal do Universo',
        1.00,
        '/res/images/time_fiber.jpeg',
        1
    ),
    (
        'Flor Preta',
        100.00,
        '/res/images/black_flower.jpg',
        3
    );
