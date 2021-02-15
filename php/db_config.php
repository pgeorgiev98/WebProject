<?php
$servername = "localhost";
$username = "sheets";
$password = "badpassword";
$db = "sheets";

require 'common.php';

$link = mysqli_connect($servername, $username, $password, $db);
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    http_response_code(500);
	exit("Error: Fail to connect with database!");
}
query($conn, "use " . $db);


?>
