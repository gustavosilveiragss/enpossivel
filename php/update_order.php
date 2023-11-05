<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
error_reporting(-1);
ini_set('display_errors', 'On');

$env_file = file_get_contents("../.env");
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

// first update or insert the account's card data
$stmt = $db->prepare("SELECT card_id FROM card WHERE account_id = ? LIMIT 1");
$stmt->bind_param("i", $_POST["account_id"]);
$stmt->execute();

$card_expiration_date = "20{$_POST["card-expiration-date-year"]}-{$_POST["card-expiration-date-month"]}-01";

$card_query_result = $stmt->get_result();
$card_id = -1;
if ($card_query_result->num_rows === 0) {
    $stmt = $db->prepare("INSERT INTO card(account_id, card_owner_name, card_number, card_expiration_date, card_cvv) VALUES(?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $_POST["account_id"], $_POST["card-owner-name"], $_POST["card-number"], $card_expiration_date, $_POST["card-cvv"]);
    $stmt->execute();

    $card_id = $db->insert_id;
} else {
    $card_id = $card_query_result->fetch_assoc()["card_id"];

    $stmt = $db->prepare("UPDATE card SET card_owner_name = ?, card_number = ?, card_expiration_date = ?, card_cvv = ? WHERE account_id = ?");
    $stmt->bind_param("ssssi", $_POST["card-owner-name"], $_POST["card-number"], $card_expiration_date, $_POST["card-cvv"], $_POST["account_id"]);
    $stmt->execute();
}


$stmt = $db->prepare("SELECT payment_method_id FROM payment_method WHERE name = ? LIMIT 1");
$stmt->bind_param("s", $_POST["payment-method"]);
$stmt->execute();
$payment_method_id = $stmt->get_result()->fetch_assoc()["payment_method_id"];

$stmt2 = $db->prepare("UPDATE `order` SET cpf = ?, status = 'pendente', payment_method_id = ?, card_id = ? WHERE order_id = ?");
$stmt2->bind_param("siii", $_POST["cpf"], $payment_method_id, $card_id, $_POST["order_id"]);
$stmt2->execute();
