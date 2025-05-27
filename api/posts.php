<?php
require_once '../vendor/firebase/php-jwt/src/JWT.php';
require_once '../vendor/firebase/php-jwt/src/Key.php';
require_once '../config/db.php';

header("Content-Type: application/json");

// Verify JWT token
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

    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title'], $data['content'])) {
        http_response_code(400);
        echo json_encode(["error" => "Title and content are required"]);
        exit;
    }

    // Insert new post
    $stmt = $pdo->prepare("
        INSERT INTO posts (user_id, title, content, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())
    ");

    $stmt->execute([
        $userId,
        $data['title'],
        $data['content']
    ]);

    echo json_encode([
        "message" => "Post created successfully",
        "post_id" => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token"]);
}
