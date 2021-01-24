<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WebProject\Socket;
use WebProject\DocumentManager;

$servername = "localhost";
$username = "sheets";
$password = "badpassword";
$db = "sheets";

$dbconn = mysqli_connect($servername, $username, $password, $db);
if ($dbconn->connect_error) {
	exit("Failed to connect to database");
}

$document_manager = new DocumentManager($dbconn);

$socket = new Socket($document_manager, $dbconn);
$server = IoServer::factory(
	new HttpServer(
		new WsServer(
			$socket
		)
	),
	8080
);

// TODO: Hardcoded 60 second timer
$server->loop->addPeriodicTimer(60, function() use ($socket) {
	$socket->cleanUp();
});

$server->run();

?>
