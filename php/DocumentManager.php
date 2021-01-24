<?php

namespace WebProject;

use WebProject\Document;

class DocumentManager {
	public function __construct($dbconn) {
		$this->documents = [];
		$this->dbconn = $dbconn;
	}

	public function getDocument(string $id) {
		$doc = null;

		if (array_key_exists($id, $this->documents)) {
			$doc = $this->documents[$id];
		} else {
			$doc = $this->loadDocumentFromDB($id);
			if (isset($doc)) {
				$this->documents[$id] = $doc;
			}
		}

		return $doc;
	}

	public function loadDocumentFromDB(string $id) {
		$result = $this->dbconn->query("SELECT table_data FROM documents WHERE id='" . $id . "'");
		$document = null;
		if (!$result) {
			echo $this->dbconn->error . '\n';
		} else {
			$row = $result->fetch_assoc();
			if ($row) {
				echo "Load " . $id . "\n";
				$rows = json_decode($row["table_data"]);
				$document = new Document($id, "TODO");
				$document->rows = $rows;
			}
		}
		return $document;
	}

	public function getDocuments() {
		return $this->documents;
	}

	public function freeDocument(string $id) {
		echo 'Free ' . $id . "\n";
		unset($this->documents[$id]);
	}
}

?>
