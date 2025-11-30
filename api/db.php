<?php
declare(strict_types=1);

$DB_HOST = 'localhost';
$DB_NAME = 'attendance_db';
$DB_USER = 'attendance_user';
$DB_PASS = 'CHANGE_THIS_PASSWORD';

$dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error'=>'Database Connection Failed']);
    exit;
}
