<?php

namespace WebProject;

use WebProject\Document;

class DocumentManager {
	public function __construct() {
		$this->documents = [];
	}

	public function getDocument(string $id) {
		$doc = &$this->documents[$id];
		if (!isset($doc)) {
			// TODO: Probably try loading it from a database or something
			$doc = new Document($id, "untitled");
		}
		return $doc;
	}

	public function loadDocumentsFromDB($dbconn) {
		$result = $dbconn->query("SELECT id,table_data FROM documents");
		while ($row = $result->fetch_assoc()) {
			$id = $row["id"];
			echo "Load " . $id . "\n";
			$rows = json_decode($row["table_data"]);
			$document = new Document($id, "");
			$document->rows = $rows;
			$this->documents[$id] = $document;
		}
	}

	public function getDocuments() {
		return $this->documents;
	}
}

?>
