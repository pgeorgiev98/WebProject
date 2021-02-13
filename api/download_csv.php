<?php

require '../php/DocumentManager.php';
require '../php/Document.php';

use WebProject\DocumentManager;
use WebProject\Document;

$servername = "localhost";
$username = "sheets";
$password = "badpassword";
$db = "sheets";

function bad_request() {
	http_response_code(400);
	exit("400 - Bad Request\nExpected arguments id=<document id> and sep=comma|dot|semicolon|colon|tab\n");
}

function internal_server_error() {
	http_response_code(500);
	exit("500 - Internal Server Error");
}

if (!isset($_GET["id"]) || !isset($_GET["sep"])) {
	bad_request();
}
$id = $_GET["id"];
$sep = $_GET["sep"];

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

$dbconn = mysqli_connect($servername, $username, $password, $db);
if ($dbconn->connect_error) {
	internal_server_error();
}

$document_manager = new DocumentManager($dbconn);

$document = $document_manager->getDocument($id);
if (!isset($document)) {
	bad_request();
}

print($document->asCsv($sep));

?>
