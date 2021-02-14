<?php

require '../php/DocumentManager.php';
require '../php/Document.php';

use WebProject\DocumentManager;
use WebProject\Document;

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

$id = random_document_id();
#query($conn, "use " . $db);
#query($conn, "INSERT INTO documents(id, table_data) VALUES('" . $id . "', '[]')");

if (count($_FILES) != 1) {
	bad_request();
}

if (!isset($_FILES['file'])) {
	bad_request();
}
$file = $_FILES['file'];

if (!isset($file['tmp_name'])) {
	bad_request();
}
$path = $file['tmp_name'];

if (!isset($_POST["sep"])) {
	bad_request();
}
$sep = $_POST["sep"];

if ($sep === 'comma') {
	$sep = ',';
} else if ($sep === 'dot') {
	$sep = '.';
} else if ($sep === 'semicolon') {
	$sep = ';';
} else if ($sep === 'colon') {
	$sep = ':';
} else if ($sep === 'tab') {
	$sep = "\t";
} else {
	bad_request();
}

if (!isset($_POST["name"])) {
	bad_request();
}
$name = $_POST["name"];

$link = mysqli_connect($servername, $username, $password, $db);
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
	internal_server_error();
}

$owner_id = $_SESSION["userID"];
$contents = file_get_contents($path);
$doc = new Document($id, $name);
$doc->setFromCsv($contents, $sep);
query($conn, "use " . $db);
query($conn, "INSERT INTO documents(id, table_data, owner_id, name) VALUES('" . $id . "', '[]', '$owner_id', '$name')");
$doc->saveToDB($conn);

echo json_encode(array(
	"id" => $id,
));

?>
