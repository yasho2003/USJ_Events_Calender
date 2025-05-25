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

    // Get total posts
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM posts WHERE user_id = ?");
    $stmt->execute([$userId]);
    $totalPosts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get total comments
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM comments WHERE user_id = ?");
    $stmt->execute([$userId]);
    $totalComments = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'totalPosts' => (int)$totalPosts,
        'totalComments' => (int)$totalComments
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token"]);
}
