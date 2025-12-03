<?php
session_start();
require_once 'db.php';

// Get JSON POST body
$data = json_decode(file_get_contents('php://input'), true);

$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

try {
    // Fetch user by email 
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
    }

    // Verify password
    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true); // Prevent session fixation
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['name'] = $user['name'];

        echo json_encode(['success' => true, 'role' => $user['role'], 'name' => $user['name']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
