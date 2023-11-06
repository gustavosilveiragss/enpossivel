<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents("../.env");
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("SELECT account_id, password FROM account a WHERE a.email = ? LIMIT 1");
$stmt->bind_param("s", $_POST["email"]);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Email ou senha inválidos"]);
    $db->close();
    die();
}

$row = $result->fetch_assoc();

// the admin user (id 1) is created manually on `creation_script.sql`
// that means it's password isn't hashed, so the `password_verify` check will fail
if ($row["account_id"] == 1) {
    if ($_POST["password"] == $row["password"]) {
        echo json_encode(["account_id" => $row["account_id"]]);
        $db->close();
        die();
    }
} else {
    if (password_verify($_POST["password"], $row["password"])) {
        echo json_encode(["account_id" => $row["account_id"]]);
        $db->close();
        die();
    }
}

http_response_code(404);
echo json_encode(["error" => "Email ou senha inválidos"]);
$db->close();
