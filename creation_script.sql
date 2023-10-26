CREATE TABLE account (
    account_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    role ENUM('account', 'admin', 'anon') DEFAULT 'anon'
);

CREATE TABLE product (
    product_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img_path VARCHAR(255) NULL
);

CREATE TABLE cart (
    cart_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE TABLE cart_item (
    cart_item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE payment_method (
    payment_method_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE `order` (
    order_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);