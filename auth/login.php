<?php
include 'db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if(!$email || !$password){
    echo "All fields are required";
    exit;
}

$stmt = $conn->prepare("SELECT password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if($stmt->num_rows == 0){
    echo "not_found";
    exit;
}

$stmt->bind_result($hash);
$stmt->fetch();

if(password_verify($password, $hash)){
    echo "success";
} else {
    echo "wrong_password";
}

$stmt->close();
$conn->close();
?>
