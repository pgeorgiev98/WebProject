<?php

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

?>
