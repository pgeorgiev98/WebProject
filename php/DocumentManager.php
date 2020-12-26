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
}

?>
