<?php

namespace WebProject;

class Document {

	public function __construct(string $id, string $name) {
		$this->id = $id;
		$this->name = $name;
		$this->rows = [];
		$this->dirty = false;
		$this->last_accessed = new \DateTime();
	}

	public function getCell(int $x, int $y) {
		$this->onAccessed();
		return $this->rows[y][x];
	}

	public function setCell(int $x, int $y, string $value) {
		// TODO: Maybe clear trailing empty cells
		for ($i = count($this->rows); $i <= $y; $i++) {
			$this->rows[$i] = [];
		}
		for ($i = count($this->rows[$y]); $i < $x; $i++) {
			$this->rows[$y][$i] = [];
		}
		$this->rows[$y][$x] = $value;
		$this->dirty = true;
		$this->onAccessed();
	}

	public function onSaved() {
		$this->dirty = false;
	}

	public function isDirty() {
		return $this->dirty;
	}

	public function onAccessed() {
		$this->last_accessed = new \DateTime();
	}

	public function getSecondsSinceAccessed() {
		return (new \DateTime())->getTimestamp() - $this->last_accessed->getTimestamp();
	}
}

?>
