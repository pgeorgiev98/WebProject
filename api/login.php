<?php
	require '../php/db_config.php';

    session_start();

    $data = json_decode(file_get_contents("php://input"));
    $facultyNumber = $data->facultyNumber;
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE facultyNumber = $facultyNumber"; 
    $result = $conn->query($sql);

    
    if ($result->num_rows > 0) {
        if ($row = $result->fetch_assoc()) {
            if (strcmp($row["password"], $password) == 0) {
                // exit($row["password"] . " " . $password);
                $_SESSION["userID"] = $row["id"];
                http_response_code(200);
            } else {
                http_response_code(404); // Wrong Pass
                exit("Wrong Password");
            }
        } else {
            internal_server_error();
        }
    } else {
        internal_server_error();
    }
     
?>
