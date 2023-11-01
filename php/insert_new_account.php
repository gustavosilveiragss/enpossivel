<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$db->query("INSERT INTO account VALUES()");
$new_account_id = $db->insert_id;
$db->query("INSERT INTO cart (account_id) VALUES ($new_account_id)");

echo json_encode(array("new_account_id" => $new_account_id));

$db->commit();
$db->close();
