<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;
$title = $body->title;
$price = $body->price;
$stock = $body->stock;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("UPDATE product p SET p.title = ?, p.price = ?, p.stock = ? WHERE p.product_id = ?");

$stmt->bind_param("sdii", $title, $price, $stock, $product_id);

$stmt->execute();

$db->commit();
$db->close();

