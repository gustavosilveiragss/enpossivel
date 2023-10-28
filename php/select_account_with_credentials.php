<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents("../.env");
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("SELECT account_id FROM account a WHERE a.email = ? AND a.password = ? LIMIT 1");

$stmt->bind_param("ss", $_POST["email"], $_POST["password"]);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Invalid email or password"]);
}

while ($row = $result->fetch_assoc()) {
    echo json_encode($row);
}

$db->close();
