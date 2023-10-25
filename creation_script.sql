CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ENUM('user', 'admin')
);

CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    title VARCHAR(255),
    price DECIMAL(10, 2),
    img_path VARCHAR(255)
);

CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE cart_item (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    cart_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE payment_method (
    payment_method_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    name VARCHAR(255)
);

CREATE TABLE `order` (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);