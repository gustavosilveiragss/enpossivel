<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$data = json_decode(file_get_contents('php://input'));
$account_id = $data->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("SELECT role FROM account a WHERE a.account_id = $account_id");
$response = $query->fetch_assoc();

echo json_encode($response);
