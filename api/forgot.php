<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$step = $data['step'] ?? 1;

if (!$email) {
    echo json_encode(['success' => false, 'error' => 'Email is required']);
    exit;
}

if ($step == 1) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Email not found']);
    }
} else if ($step == 2) {
    $password = $data['password'] ?? '';
    
    if (!$password) {
        echo json_encode(['success' => false, 'error' => 'Password is required']);
        exit;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
    
    if ($stmt->execute([$hashedPassword, $email])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update password']);
    }
}
?>
