<?php
include 'db.php';

header('Content-Type: application/json'); 

$name     = trim($_POST['name'] ?? '');
$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM system WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already exists"
    ]);
    $stmt->close();
    exit;
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO system (name, email, password) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}
$stmt->bind_param("sss", $name, $email, $hash);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "email" => $email,
        "name" => $name
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
