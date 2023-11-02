<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;
$account_id = $body->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$cart_query_result =  $db->query("SELECT cart_id FROM cart WHERE account_id = $account_id LIMIT 1");
$cart_id = $cart_query_result->fetch_assoc()["cart_id"];

$db->query("INSERT INTO cart_product (cart_id, product_id) VALUES($cart_id, $product_id)");

$db->commit();
$db->close();

http_response_code(200);
