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

    // Get recent posts
    $stmt = $pdo->prepare("
        SELECT 'post' as type, title as description, created_at 
        FROM posts 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get recent comments
    $stmt = $pdo->prepare("
        SELECT 'comment' as type, 
               CONCAT('Commented on: ', p.title) as description, 
               c.created_at 
        FROM comments c 
        JOIN posts p ON c.post_id = p.id 
        WHERE c.user_id = ? 
        ORDER BY c.created_at DESC 
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Combine and sort activities
    $activities = array_merge($posts, $comments);
    usort($activities, function ($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });

    // Format dates and limit to 5 most recent activities
    $activities = array_slice($activities, 0, 5);
    foreach ($activities as &$activity) {
        $activity['created_at'] = date('M j, Y g:i A', strtotime($activity['created_at']));
    }

    echo json_encode($activities);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token"]);
}
