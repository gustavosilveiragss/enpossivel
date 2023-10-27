<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;
// FIXME: find the cart associated with the user currently authenticated
$cart_id = 1;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$db->query("INSERT INTO cart_item (cart_id, product_id) VALUES($cart_id, $product_id)");

$db->commit();
$db->close();

http_response_code(200);
