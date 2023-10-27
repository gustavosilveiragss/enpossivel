<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));

// FIXME: find the cart associated with the user currently authenticated
$cart_id = 1;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$query = $db->query("DELETE FROM cart_item ci
WHERE ci.cart_id = $cart_id
AND ci.product_id = $body->product_id
AND ci.created_at = (
    # we need to make a nested subquery here because mysql is very well made :)
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
