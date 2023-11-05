<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$search = "%{$body->search}%";

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("SELECT * FROM product p WHERE LOWER(p.title) LIKE LOWER(?) AND p.stock > 0 AND p.active = 1");

$stmt->bind_param("s", $search);

$stmt->execute();
$result = $stmt->get_result();

$response = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($response);
