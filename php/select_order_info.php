<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$account_id = $body->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("SELECT * FROM `order` WHERE account_id = ? ORDER BY created_at DESC LIMIT 1");
$stmt->bind_param("i", $account_id);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows == 0) {
    http_response_code(400);
    exit();
}

$response = $result->fetch_assoc();
if ($response["status"] === 'finalizado') {
    http_response_code(400);
    exit();
}


$last_order_info = null;
$last_order_card_info = null;

$stmt = $db->prepare("SELECT * FROM `order` WHERE account_id = ? AND status = 'finalizado' ORDER BY created_at DESC LIMIT 1;");
$stmt->bind_param("i", $account_id);
$stmt->execute();

$last_order_result = $stmt->get_result();
if ($last_order_result->num_rows > 0) {
    $last_order_info = $last_order_result->fetch_assoc();
    if ($last_order_info["card_id"] != null) {
        $stmt = $db->prepare("SELECT * FROM card WHERE card_id = ? LIMIT 1");
        $stmt->bind_param("i", $last_order_info["card_id"]);
        $stmt->execute();

        $last_order_card_info = $stmt->get_result()->fetch_assoc();
        $last_order_card_info["card_expiration_date_month"] = substr($last_order_card_info["card_expiration_date"], 5, 2);
        $last_order_card_info["card_expiration_date_year"] = substr($last_order_card_info["card_expiration_date"], 2, 2);
    }
}

echo json_encode(array("order" => $response, "last_order_info" => $last_order_info, "last_order_card_info" => $last_order_card_info));

$db->close();
