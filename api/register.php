<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = htmlspecialchars($data['name'] ?? '', ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'student';
$subject = htmlspecialchars($data['subject'] ?? '', ENT_QUOTES, 'UTF-8');

$allowed_roles = ['student', 'teacher', 'admin'];
if (!in_array($role, $allowed_roles)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid role']);
    exit;
}

if (!$name || !$email || !$password || ($role === 'teacher' && !$subject)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    if ($role === 'teacher') {
        $stmt = $pdo->prepare("INSERT INTO teachers (name, email, password_hash, subject, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hash, $subject, $role]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hash, $role]);
    }

    // Optional: log in immediately
    session_start();
    session_regenerate_id(true); // Prevent session fixation
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $role;
    $_SESSION['name'] = $name;

    echo json_encode(['success' => true, 'role' => $role, 'name' => $name]);
} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage()); // Log the error
    http_response_code(500);
    echo json_encode(['error' => 'User registration failed']);
}
