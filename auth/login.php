<?php
include 'db.php';

$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, email, password FROM system WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["status" => "not_found"]);
    exit;
}

$stmt->bind_result($id, $name, $email_db, $hash);
$stmt->fetch();

if (password_verify($password, $hash)) {
    echo json_encode([
        "status" => "success",
        "id" => $id,
        "name" => $name,
        "email" => $email_db
    ]);
} else {
    echo json_encode(["status" => "wrong_password"]);
}

$stmt->close();
$conn->close();
?>
