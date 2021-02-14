<?php
    session_start();

    function query(mysqli $conn, string $q) {
        if (!$conn->query($q)) {
            internal_server_error();
        } 
    }

    function internal_server_error() {
        http_response_code(500);
        exit("500 - Internal Server Error");
    }

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
    $facultyNumber = $data->facultyNumber;
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE facultyNumber = $facultyNumber"; 
    query($conn, "use " . $db);
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