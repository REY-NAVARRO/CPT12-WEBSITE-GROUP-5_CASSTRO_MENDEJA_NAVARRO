<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$step = $data['step'] ?? 1;

if (!$email) {
    echo json_encode(['success' => false, 'error' => 'Valid email is required']);
    exit;
}

if ($step == 1) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        $stmt = $pdo->prepare("SELECT id FROM teachers WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
    }
    
    if ($user) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Email not found']);
    }
} else if ($step == 2) {
    $password = $data['password'] ?? '';
    
    if (!$password || strlen($password) < 8) {
        echo json_encode(['success' => false, 'error' => 'Password must be at least 8 characters']);
        exit;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->execute([$hashedPassword, $email]);
    
    if ($stmt->rowCount() === 0) {
        $stmt = $pdo->prepare("UPDATE teachers SET password_hash = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $email]);
    }
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update password']);
    }
}
?>
