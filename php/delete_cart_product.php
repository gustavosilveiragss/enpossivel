<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$account_id = $body->account_id;
// INVARIANT: for every account there is a single cart
$cart_id = $account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("DELETE FROM cart_product cp
WHERE cp.cart_id = $cart_id
AND cp.product_id = $body->product_id
AND cp.created_at = (
    # https://stackoverflow.com/a/12969601
    SELECT newest_item FROM (
        SELECT MAX(cp2.created_at) as newest_item
        FROM cart_product cp2
        WHERE cp2.cart_id = $cart_id
        AND cp2.product_id = $body->product_id
) dummy)
LIMIT 1");

$db->commit();
$db->close();
