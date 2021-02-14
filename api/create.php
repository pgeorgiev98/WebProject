<?php
$servername = "localhost";
$username = "sheets";
$password = "badpassword";
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

function random_document_id() {
	define("ID_LENGTH", 80);
	define("HEX_DIGITS", "0123456789abcdef");
	$result = "";
	for ($i = 0; $i < ID_LENGTH; $i++) {
		$result .= HEX_DIGITS[rand(0, 15)];
	}
	return $result;
}

function query(mysqli $conn, string $q) {
	if (!$conn->query($q)) {
		internal_server_error();
	}
}

if (!isset($_GET["name"])) {
	bad_request();
}
$name = $_GET["name"];

$link = mysqli_connect($servername, $username, $password, $db);
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
	internal_server_error();
}

$id = random_document_id();
$owner_id = $_SESSION["userID"];
query($conn, "use " . $db);
query($conn, "INSERT INTO documents(id, table_data, owner_id, name) VALUES('" . $id . "', '[]', '$owner_id', '$name')");

echo json_encode(array(
	"id" => $id,
));

?>
