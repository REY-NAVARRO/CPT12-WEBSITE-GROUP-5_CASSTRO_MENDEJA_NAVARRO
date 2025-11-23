<?php
$host = "localhost";
$db = "student_attendance";
$user = "root";      
$pass = "";          

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}
?>
