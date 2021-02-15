<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WebProject\Socket;
use WebProject\DocumentManager;

require 'php/db_config.php';

$document_manager = new DocumentManager($conn);

$socket = new Socket($document_manager, $conn);
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
