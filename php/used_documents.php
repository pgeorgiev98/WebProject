<?php

require 'db_config.php';

session_start();

$user_id = $_SESSION["userID"];

// exit($_SESSION);

$sql = "SELECT * FROM documents WHERE owner_id = '".$user_id."'"; 
$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)){
    $rows[] = $r;
}

echo json_encode($rows);

?>
