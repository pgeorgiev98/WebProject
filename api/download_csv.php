<?php

require '../php/DocumentManager.php';
require '../php/Document.php';
require '../php/db_config.php';

use WebProject\DocumentManager;
use WebProject\Document;

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

$document_manager = new DocumentManager($conn);

$document = $document_manager->getDocument($id);
if (!isset($document)) {
	bad_request();
}

print($document->asCsv($sep));

?>
