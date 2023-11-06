<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$body = json_decode(file_get_contents('php://input'));
$product_id = $body->product_id;
$account_id = $body->account_id;
// INVARIANT: for every account there is a single cart
$cart_id = $account_id;

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);
$stmt = $db->prepare("SELECT stock FROM product WHERE product_id = ?");

$stmt->bind_param("i", $product_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["error" => "Produto não encontrado"]);
    $db->close();
    die();
}

$row = $result->fetch_assoc();
$stock = $row['stock'];

if ($stock <= 0) {
    http_response_code(500);
    echo json_encode(["error" => "Produto fora de estoque"]);
    $db->close();
    die();
}

echo $cart_id;
echo $product_id;

$stmt = $db->prepare("INSERT INTO cart_product (cart_id, product_id) VALUES (?,?)");

$stmt->bind_param("ii", $cart_id, $product_id);

$stmt->execute();

$stmt = $db->prepare("UPDATE product SET stock = stock - 1 WHERE product_id = ?");

$stmt->bind_param("i", $product_id);

$stmt->execute();

$db->commit();
$db->close();