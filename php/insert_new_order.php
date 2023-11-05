<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));

$account_id = $body->account_id;
$total_price = $body->total_price;
$cart_id = $account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$db->query("INSERT INTO `order` (account_id, total_price) VALUES ($account_id, $total_price)");
$order_id = $db->insert_id;

$query = $db->query("SELECT product_id FROM cart_product WHERE cart_id = $account_id");
$rows = $query->fetch_all(MYSQLI_ASSOC);

// copy all the products from the cart to the order
foreach ($rows as $row) {
    $product_id = $row["product_id"];
    $db->query("INSERT INTO order_product (order_id, product_id) VALUES ($order_id, $product_id)");
}

$db->commit();
$db->close();
