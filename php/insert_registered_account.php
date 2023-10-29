<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents("../.env");
$env = parse_ini_string($env_file);

$password = password_hash($_POST["password"], PASSWORD_DEFAULT);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("SELECT account_id FROM account a WHERE a.email = ? LIMIT 1");

$stmt->bind_param("s", $_POST["email"]);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Já tem crachá com esse email!"]);
    $db->close();
    die();
}

$stmt = $db->prepare("UPDATE account a SET a.name = ?, a.email = ?, a.password = ?, a.role = 'user' WHERE a.account_id = ?");

$stmt->bind_param("sssi", $_POST["name"], $_POST["email"], $password, $_POST["account_id"]);

$stmt->execute();

$db->commit();
$db->close();
