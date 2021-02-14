<?php

$servername = "localhost";
$usernameDB = "sheets";
$passwordDB = "badpassword";
$db = "sheets";

session_start();

function bad_request() {
	http_response_code(400);
	exit("400 - Bad Request");
}

function internal_server_error() {
	http_response_code(500);
	exit("500 - Internal Server Error");
}

function query(mysqli $conn, string $q) {
	if (!$conn->query($q)) {
		internal_server_error();
	}
}

$link = mysqli_connect($servername, $usernameDB, $passwordDB, $db);
$conn = new mysqli($servername, $usernameDB, $passwordDB);

if ($conn->connect_error) {
    internal_server_error();
}


$user_id = $_SESSION["userID"];

// exit($_SESSION);

$sql = "SELECT * FROM documents WHERE owner_id = '".$user_id."'"; 
query($conn, "use " . $db);
$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)){
    $rows[] = $r;
}

echo json_encode($rows);

?>