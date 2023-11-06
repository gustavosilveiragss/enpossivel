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


$card_info = null;

$stmt = $db->prepare("SELECT * FROM card WHERE account_id = ? LIMIT 1");
$stmt->bind_param("i", $account_id);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $card_info = $result->fetch_assoc();
}

$card_info["card_expiration_date_month"] = substr($card_info["card_expiration_date"], 5, 2);
$card_info["card_expiration_date_year"] = substr($card_info["card_expiration_date"], 2, 2);

echo json_encode(array("order" => $response, "card_info" => $card_info));

$db->close();
