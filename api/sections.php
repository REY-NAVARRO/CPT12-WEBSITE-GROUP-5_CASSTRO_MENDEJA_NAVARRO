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

    if (!$section || !$subject || !$userEmail) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO sections (section_name, subject, owner_user_id) 
                           VALUES (:section, :subject, (SELECT id FROM users WHERE email=:email))");
    $stmt->execute([
        'section' => $section,
        'subject' => $subject,
        'email' => $userEmail
    ]);

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

    $stmt = $pdo->prepare("
        DELETE s FROM sections s
        JOIN users u ON s.owner_user_id = u.id
        WHERE s.id = ? AND u.email = ?
    ");
    $stmt->execute([$sectionId, $userEmail]);

    if ($stmt->rowCount()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'You do not have permission to delete this section']);
    }
    exit;
}

$stmt = $pdo->query("
  SELECT s.id, s.section_name, s.subject, u.email AS owner_email
  FROM sections s
  JOIN users u ON s.owner_user_id = u.id
");
$sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($sections);
