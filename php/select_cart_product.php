<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$account_id = $body->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$cart_query_result = $db->query("SELECT cart_id FROM cart WHERE account_id = $account_id");
$cart_id = $cart_query_result->fetch_assoc()["cart_id"];

$query = $db->query("SELECT p.*, COUNT(*) AS quantity
FROM cart c
JOIN cart_product cp ON cp.cart_id = $cart_id
JOIN product p ON p.product_id = cp.product_id
WHERE c.cart_id = $cart_id
GROUP BY p.product_id
ORDER BY MIN(cp.created_at) ASC");
$response = $query->fetch_all(MYSQLI_ASSOC);

echo json_encode($response);
