<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$account_id = $body->account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$cart_query_result =  $db->query("SELECT cart_id FROM cart WHERE account_id = $account_id LIMIT 1");
$cart_id = $cart_query_result->fetch_assoc()["cart_id"];

$query = $db->query("DELETE FROM cart_item ci
WHERE ci.cart_id = $cart_id
AND ci.product_id = $body->product_id
AND ci.created_at = (
    # https://stackoverflow.com/a/12969601
    SELECT newest_item FROM (
        SELECT MAX(ci2.created_at) as newest_item
        FROM cart_item ci2
        WHERE ci2.cart_id = $cart_id
        AND ci2.product_id = $body->product_id
) dummy)
LIMIT 1");

$db->commit();
$db->close();
