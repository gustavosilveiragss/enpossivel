<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$query = $db->query("DELETE FROM cart_product cp WHERE cp.product_id = $product_id");

// delete the product only if there are no order_products with that id

$query = $db->query("SELECT 1 FROM order_product op WHERE op.product_id = $product_id");

if ($query->num_rows > 0) {
    $query = $db->query("UPDATE product p SET p.stock = 0, p.active = 0 WHERE p.product_id = $product_id");
    $db->close();
    die();
}

$query = $db->query("DELETE FROM product p WHERE p.product_id = $product_id");

$db->commit();
$db->close();
