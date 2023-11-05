<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;
$account_id = $body->account_id;
// INVARIANT: for every account there is a single cart
$cart_id = $account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$db->query("INSERT INTO cart_product (cart_id, product_id) VALUES($cart_id, $product_id)");

$db->commit();
$db->close();

http_response_code(200);
