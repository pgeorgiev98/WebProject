<?php

    function internal_server_error() {
        http_response_code(500);
        exit("500 - Internal Server Error");
    }

    function query(mysqli $conn, string $q) {
        if (!$conn->query($q)) {
            internal_server_error();
        } 
    }

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

    $servername = "localhost";
    $usernameDB = "sheets";
    $passwordDB = "badpassword";
    $db = "sheets";

    $link = mysqli_connect($servername, $usernameDB, $passwordDB, $db);
    $conn = new mysqli($servername, $usernameDB, $passwordDB);

    if ($conn->connect_error) {
        internal_server_error();
    }

    $data = json_decode(file_get_contents("php://input"));
    $username = $data->username;
    $facultyNumber = $data->facultyNumber;
    $password = $data->password;
    $id = random_id();

    $sql = "SELECT * FROM users WHERE facultyNumber = $facultyNumber"; 
    query($conn, "use " . $db);
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        //This user already exist
        http_response_code(204);
    } else {
        $sql = "INSERT INTO users(id,username,password,facultyNumber) VALUES ('$id','$username','$password','$facultyNumber')";
        query($conn, "use " . $db);
        $result = $conn->query($sql);

        if ($result) {
            $_SESSION["userID"] = $id;
            http_response_code(200); 
        }else{
            internal_server_error();
        }
    }
?>