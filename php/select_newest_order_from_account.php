<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$account_id = $body->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("SELECT * FROM `order` WHERE account_id = $account_id ORDER BY created_at DESC LIMIT 1");
if ($query->num_rows == 0) {
    http_response_code(400);
    exit();
}

$response = $query->fetch_assoc();
if ($response["status"] === 'finalizado') {
    http_response_code(400);
    exit();
}

echo json_encode($response);

$db->close();
