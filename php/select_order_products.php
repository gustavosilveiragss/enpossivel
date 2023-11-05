<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$order_id = $body->order_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("SELECT p.*, COUNT(*) AS quantity
FROM order_product op
JOIN product p ON p.product_id = op.product_id
WHERE op.order_id = $order_id
GROUP BY p.product_id
ORDER BY MIN(op.created_at) ASC");

$response = $query->fetch_all(MYSQLI_ASSOC);
echo json_encode($response);

$db->close();
