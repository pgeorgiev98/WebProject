<?php

require '../php/db_config.php';

session_start();

if (!isset($_GET["name"])) {
	bad_request();
}
$name = $_GET["name"];

$id = random_document_id();
$owner_id = $_SESSION["userID"];
query($conn, "INSERT INTO documents(id, table_data, owner_id, name) VALUES('" . $id . "', '[]', '$owner_id', '$name')");

echo json_encode(array(
	"id" => $id,
));

?>
