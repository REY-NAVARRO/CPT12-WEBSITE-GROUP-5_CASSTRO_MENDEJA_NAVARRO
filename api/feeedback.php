<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$rating = $data['rating'] ?? 0;
$message = $data['message'] ?? '';

$stmt = $pdo->prepare("INSERT INTO feedback (name, email, phone, rating, message) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$name, $email, $phone, $rating, $message]);

echo json_encode(['success' => true]);
