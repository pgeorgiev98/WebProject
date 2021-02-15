<?php

require '../php/DocumentManager.php';
require '../php/Document.php';
require '../php/db_config.php';

use WebProject\DocumentManager;
use WebProject\Document;

session_start();

$id = random_document_id();

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

$owner_id = $_SESSION["userID"];
$contents = file_get_contents($path);
$doc = new Document($id, $name);
$doc->setFromCsv($contents, $sep);
query($conn, "INSERT INTO documents(id, table_data, owner_id, name) VALUES('" . $id . "', '[]', '$owner_id', '$name')");
$doc->saveToDB($conn);

echo json_encode(array(
	"id" => $id,
));

?>
