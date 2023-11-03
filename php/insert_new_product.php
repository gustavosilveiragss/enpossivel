<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$path = '/res/images/' . $_FILES["image"]['name'];

if (move_uploaded_file($_FILES["image"]["tmp_name"], __DIR__ . "/.." . $path)) {
    echo json_encode($_FILES["image"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Algo deu errado. Verifique as permissões da pasta de imagens."]);
    $db->close();
    die();
}

$env_file = file_get_contents('../.env');
$env = parse_ini_string($env_file);

$db = new mysqli($env["DB_HOST"], $env["DB_USER"], $env["DB_PASSWORD"], $env["DB_DATABASE"]);

$stmt = $db->prepare("INSERT INTO product (title, price, img_path, stock) VALUES (?, ?, ?, ?)");

$stmt->bind_param("sdsi", $_POST["title"], $_POST["price"], $path, $_POST["stock"]);

$stmt->execute();

$db->commit();
$db->close();
