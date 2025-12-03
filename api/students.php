<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'You must be logged in']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sectionName = $_GET['section'] ?? '';
    if (!$sectionName) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing section']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, name, image, status, DATE_FORMAT(added_at, '%Y-%m-%d %H:%i:%s') as added_at FROM students WHERE section_name = ? ORDER BY added_at DESC");
    $stmt->execute([$sectionName]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sectionName = $data['section'] ?? '';
    $name = trim($data['name'] ?? '');

    if (!$sectionName || !$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO students (section_name, name) VALUES (?, ?)");
    $stmt->execute([$sectionName, $name]);

    $id = $pdo->lastInsertId();
    echo json_encode([
        'id' => $id,
        'name' => $name,
        'status' => 'Pending',
        'added_at' => date('Y-m-d H:i:s'),
        'image' => null
    ]);
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $studentId = $data['student_id'] ?? '';
    $status = $data['status'] ?? '';
    if (!$studentId || !$status) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE students SET status = ? WHERE id = ?");
    if ($stmt->execute([$status, $studentId]))
        echo json_encode(['success' => true]);
    else
        echo json_encode(['error' => 'Failed to update status']);
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $studentId = $data['student_id'] ?? '';
    if (!$studentId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing student_id']);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
    if ($stmt->execute([$studentId]))
        echo json_encode(['success' => true]);
    else
        echo json_encode(['error' => 'Failed to delete student']);
}
