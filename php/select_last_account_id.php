<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("SELECT Auto_increment as id FROM information_schema.tables WHERE TABLE_SCHEMA = 'enpossivel' AND TABLE_NAME ='account'");
$response = $query->fetch_all(MYSQLI_ASSOC);

echo json_encode($response[0]);
