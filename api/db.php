<?php
// db.php
$host = getenv('DB_HOST') ?: 'mysql-12345.aivencloud.com';
$db   = getenv('DB_NAME') ?: 'defaultdb';
$user = getenv('DB_USER') ?: 'avnadmin';
$pass = getenv('DB_PASSWORD') ?: 'YOUR_PASSWORD';
$port = getenv('DB_PORT') ?: '12345';
$ssl_ca = getenv('MYSQL_CA_CERT') ?: null;

$dsn = "mysql:host=$host;dbname=$db;port=$port;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

if ($ssl_ca) {
    $options[PDO::MYSQL_ATTR_SSL_CA] = "/tmp/ca.pem";
    file_put_contents("/tmp/ca.pem", base64_decode($ssl_ca));
}

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}
