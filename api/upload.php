<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'You must be logged in']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

$student_id = $_POST['student_id'] ?? '';
if (!$student_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing student ID']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/'; 
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$filename = uniqid('student_') . '.' . $ext;
$filepath = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
    exit;
}


$fileUrl = '/uploads/' . $filename;

$stmt = $pdo->prepare("UPDATE students SET image = ? WHERE id = ?");
$stmt->execute([$fileUrl, $student_id]);

echo json_encode(['success' => true, 'url' => $fileUrl]);
