<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents("../.env");
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("UPDATE account a SET a.name = ?, a.email = ?, a.password = ?, a.role = 'account' WHERE a.account_id = ?");

$stmt->bind_param("sssi", $_POST["name"], $_POST["email"], $_POST["password"], $_POST["account_id"]);

$stmt->execute();

$db->commit();
$db->close();
