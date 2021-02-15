<?php

	require '../php/db_config.php';

    function random_id() {
        define("ID_LENGTH", 20);
        define("HEX_DIGITS", "0123456789abcdef");
        $result = "";
        for ($i = 0; $i < ID_LENGTH; $i++) {
            $result .= HEX_DIGITS[rand(0, 15)];
        }
        return $result;
    }

    session_start();

    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $facultyNumber = $data->facultyNumber;
    $password = $data->password;
    $id = random_id();

    $sql = "SELECT * FROM users WHERE facultyNumber = $facultyNumber"; 
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        //This user already exist
        http_response_code(204);
    } else {
        $sql = "INSERT INTO users(id,username,password,facultyNumber) VALUES ('$id','$username','$password','$facultyNumber')";
        $result = $conn->query($sql);

        if ($result) {
            $_SESSION["userID"] = $id;
            http_response_code(200); 
        }else{
            internal_server_error();
        }
    }
?>
