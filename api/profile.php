<?php
require_once '../vendor/firebase/php-jwt/src/JWT.php';
require_once '../vendor/firebase/php-jwt/src/Key.php';
require_once '../config/db.php';

header("Content-Type: application/json");

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

list(, $token) = explode(' ', $headers['Authorization']);

try {
    $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256'));
    $userId = $decoded->data->id;

    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($user);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token"]);
}