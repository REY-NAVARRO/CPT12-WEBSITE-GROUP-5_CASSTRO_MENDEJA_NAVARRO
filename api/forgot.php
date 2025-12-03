<?php
header('Content-Type: application/json');
require_once 'db.php';

error_log("Forgot password request received");

$data = json_decode(file_get_contents('php://input'), true);
error_log("Request data: " . json_encode($data));

$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$step = $data['step'] ?? 1;

error_log("Email: $email, Step: $step");

if (!$email) {
    echo json_encode(['success' => false, 'error' => 'Valid email is required']);
    exit;
}

if ($step == 1) {
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $stmt = $pdo->prepare("SELECT id FROM teachers WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
        }
        
        if ($user) {
            error_log("Email found: $email");
            echo json_encode(['success' => true]);
        } else {
            error_log("Email not found: $email");
            echo json_encode(['success' => false, 'error' => 'Email not found']);
        }
    } catch (Exception $e) {
        error_log("Step 1 error: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
} else if ($step == 2) {
    $password = $data['password'] ?? '';
    
    if (!$password || strlen($password) < 8) {
        error_log("Password validation failed");
        echo json_encode(['success' => false, 'error' => 'Password must be at least 8 characters']);
        exit;
    }
    
    try {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $email]);
        
        if ($stmt->rowCount() === 0) {
            $stmt = $pdo->prepare("UPDATE teachers SET password_hash = ? WHERE email = ?");
            $stmt->execute([$hashedPassword, $email]);
        }
        
        if ($stmt->rowCount() > 0) {
            error_log("Password updated successfully for: $email");
            echo json_encode(['success' => true]);
        } else {
            error_log("No rows updated for: $email");
            echo json_encode(['success' => false, 'error' => 'Failed to update password']);
        }
    } catch (Exception $e) {
        error_log("Step 2 error: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
}
?>
