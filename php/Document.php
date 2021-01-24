<?php

namespace WebProject;

class Document {

	public function __construct(string $id, string $name) {
		$this->id = $id;
		$this->name = $name;
		$this->rows = [];
		$this->dirty = false;
	}

	public function getCell(int $x, int $y) {
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
	}

	public function onSaved() {
		$this->dirty = false;
	}

	public function isDirty() {
		return $this->dirty;
	}
}

?>
