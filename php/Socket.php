<?php

namespace WebProject;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Socket implements MessageComponentInterface {

	public function __construct($document_manager, $dbconn) {
		$this->clients = new \SplObjectStorage;
		$this->document_manager = $document_manager;
		$this->dbconn = $dbconn;
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
			if (isset($doc)) {
				$response = array(
					"command" => $command,
					"data" => $doc->rows
				);
				$from->send(json_encode($response));
			}

		} else if ($command == "get_cell") {
			$id = $from->document_id;
			$doc = $this->document_manager->getDocument($id);
			if (isset($doc)) {
				$x = $json["x"];
				$y = $json["y"];
				$response = json_encode(array(
					"command" => $command,
					"x" => $x,
					"y" => $y,
					"value" => $doc->getCell($x, $y)
				));
				$from->send($value);
			}

		} else if ($command == "set_cell") {
			$id = $from->document_id;
			$doc = $this->document_manager->getDocument($id);
			if (isset($doc)) {
				$x = $json["x"];
				$y = $json["y"];
				$value = $json["value"];

				$doc->setCell($x, $y, $value);
				foreach ($this->clients as $client) {
					if ($from->resourceId != $client->resourceId && $client->document_id == $id) {
						$client->send($msg);
					}
				}
			}

		}
	}

	public function onClose(ConnectionInterface $conn) {
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
	}

	public function cleanUp() {
		$toFree = array();

		foreach ($this->document_manager->getDocuments() as $document) {
			$freeDocument = ($document->getSecondsSinceAccessed() > 120); // TODO: hardcoded constant
			if ($document->isDirty() || $freeDocument) {
				echo "Saving document " . $document->id . "\n";
				if (!$this->dbconn->query("UPDATE documents SET table_data='" . json_encode($document->rows) . "' WHERE id='" . $document->id . "'")) {
					echo "Failed: " . $this->dbconn->error . "\n";
				} else {
					$document->onSaved();
				}

				if ($freeDocument) {
					array_push($toFree, $document->id);
				}
			}
		}

		foreach ($toFree as $id) {
			$this->document_manager->freeDocument($id);
		}
	}
}

?>
