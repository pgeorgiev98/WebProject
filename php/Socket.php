<?php

namespace WebProject;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use WebProject\DocumentManager;

class Socket implements MessageComponentInterface {

	public function __construct() {
		$this->clients = new \SplObjectStorage;
		$this->document_manager = new DocumentManager();
	}

	public function onOpen(ConnectionInterface $conn) {
		$this->clients->attach($conn);
	}

	public function onMessage(ConnectionInterface $from, $msg) {

		// TODO: Error checking; Any protocol error could cause a crash

		$json = json_decode($msg, true);

		$command = $json["command"];

		if ($command == "open") {
			$id = $json["id"];
			$from->document_id = $id;

		} else if ($command == "get_document_json") {
			$id = $from->document_id;
			$doc = $this->document_manager->getDocument($id);
			$response = array(
				"command" => $command,
				"data" => $doc->rows
			);
			$from->send(json_encode($response));

		} else if ($command == "get_cell") {
			$id = $from->document_id;
			$doc = $this->document_manager->getDocument($id);
			$x = $json["x"];
			$y = $json["y"];
			$response = json_encode(array(
				"command" => $command,
				"x" => $x,
				"y" => $y,
				"value" => $doc->getCell($x, $y)
			));
			$from->send($value);

		} else if ($command == "set_cell") {
			$id = $from->document_id;
			$doc = $this->document_manager->getDocument($id);
			$x = $json["x"];
			$y = $json["y"];
			$value = $json["value"];

			$doc->setCell($x, $y, $value);
			foreach ($this->clients as $client) {
				if ($from->resourceId == $client->resourceId) {
					continue;
				}
				$client->send($msg);
			}

		}
	}

	public function onClose(ConnectionInterface $conn) {
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
	}
}

