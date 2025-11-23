<?php
include 'db.php';

$step = $_POST['step'] ?? '';
$email = strtolower(trim($_POST['email'] ?? ''));

// Step 1: Check if email exists
if ($step == 1) {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "found";
    } else {
        echo "not_found";
    }
    $stmt->close();
    exit;
}

if ($step == 2) {
    $password = trim($_POST['password'] ?? '');
    if (!$password) {
        echo "error"; 
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("UPDATE users SET password=? WHERE email=?");
    $stmt->bind_param("ss", $hash, $email);
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }
    $stmt->close();
    exit;
}

$conn->close();
?>
