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

	public function setCell(int $x, int $y, array $value) {
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

	public function asCsv($sep) {
		$csv = "";
		foreach ($this->rows as $row) {
			$new_row = [];
			foreach ($row as $cell) {
				$str = (empty($cell) ? '' : $cell[0]);
				$str = str_replace($sep, '?', $str);
				$new_row[] = $str;
			}
			$csv .= join($sep, $new_row);
			$csv .= "\n";
		}
		return $csv;
	}

	public function setFromCsv($csv, $sep) {
		$this->rows = explode("\n", $csv);
		foreach ($this->rows as &$row) {
			$row = explode($sep, $row);
			foreach ($row as &$cell) {
				$cell = [$cell];
			}
		}
	}

	public function saveToDB($conn) {
		return $conn->query("UPDATE documents SET table_data='" . json_encode($this->rows) . "' WHERE id='" . $this->id . "'");
	}
}

?>
