<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

// FIXME: find the cart associated with the user currently authenticated
$cart_id = 1;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("SELECT p.*, COUNT(*) AS quantity
FROM cart
JOIN cart_item ci ON ci.cart_id = $cart_id
JOIN product p ON p.product_id = ci.product_id
WHERE cart.cart_id = $cart_id
GROUP BY p.product_id
ORDER BY MIN(ci.created_at) ASC");
$response = $query->fetch_all(MYSQLI_ASSOC);

echo json_encode($response);
