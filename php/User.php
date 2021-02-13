<?php

class User {

	var $id;
	var $username;
	var $facultyNumber;
	var $password;
	
	public function __construct(string $id, string $username, int $facultyNumber, string $password) {
		$this->id = $id;
		$this->username = $username;
        $this->facultyNumber = $facultyNumber;
        $this->password = $password;
	}

	public function logout() {
		session_start();
		unset($_SESSION["userID"]);
		header("Location:login.php");
	}

	public function getUserFromDB(string $id) {
		/*$servername = "localhost";
		$usernameDB = "sheets";
		$passwordDB = "badpassword";
		$db = "sheets";
	
		$link = mysqli_connect($servername, $usernameDB, $passwordDB, $db);
		$conn = new mysqli($servername, $usernameDB, $passwordDB);
	
		if ($conn->connect_error) {
			internal_server_error();
		}

		$sql = "SELECT * FROM users WHERE id = $id"; 
		query($conn, "use " . $db);
		$result = $conn->query($sql);

		if (!$result) {
			echo $this->dbconn->error . '\n';
		} else {
			$row = $result->fetch_assoc();
			if ($row) {
				echo "Load " . $id . "\n";
				$rows = json_decode($row["table_data"]);
				$document = new User()
				$document->rows = $rows;
			}
		}
		return $document;
		*/
	}


}

?>
