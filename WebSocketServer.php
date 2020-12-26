<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WebProject\Socket;

$server = IoServer::factory(
	new HttpServer(
		new WsServer(
			new Socket()
		)
	),
	8080
);

$server->run();

?>
