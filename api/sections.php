<?php
header('Content-Type: application/json');
session_start();
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $section = trim($data['section'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $userEmail = $_SESSION['email'] ?? '';

    if (!$section || !$subject) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing section or subject']);
        exit;
    }

    if (!$userEmail) {
        http_response_code(401);
        echo json_encode(['error' => 'Not logged in']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO sections (section_name, subject, owner_email) VALUES (?, ?, ?)");
    $stmt->execute([$section, $subject, $userEmail]);

    $id = $pdo->lastInsertId();

    echo json_encode([
        'id' => $id,
        'section_name' => $section,
        'subject' => $subject,
        'owner_email' => $userEmail
    ]);
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sectionId = $data['id'] ?? 0;
    $userEmail = $_SESSION['email'] ?? '';

    if (!$sectionId || !$userEmail) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM sections WHERE id = ? AND owner_email = ?");
    $stmt->execute([$sectionId, $userEmail]);

    if ($stmt->rowCount()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'You do not have permission to delete this section']);
    }
    exit;
}

$stmt = $pdo->query("SELECT id, section_name, subject, owner_email FROM sections ORDER BY created_at DESC");
$sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($sections);
