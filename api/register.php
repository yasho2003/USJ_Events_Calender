<?php
header("Content-Type: application/json");
require_once '../config/db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->execute([
    $data['name'],
    $data['email'],
    password_hash($data['password'], PASSWORD_DEFAULT)
]);

echo json_encode(["success" => true]);