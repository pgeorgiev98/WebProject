<?php

        function console_log($output, $with_script_tags = true) {
            $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
        ');';
            if ($with_script_tags) {
                $js_code = '<script>' . $js_code . '</script>';
            }
            
            echo $js_code;
        }

    console_log("Ehoooooooodjfjdjfdkjvkfgkjf");

    session_start();

    $servername = "localhost";
    $username = "sheets";
    $password = "badpassword";
    $db = "sheets";

    function bad_request() {
        http_response_code(400);
        exit("400 - Bad Request");
    }

    function internal_server_error() {
        http_response_code(500);
        exit("500 - Internal Server Error");
    }

    function query(mysqli $conn, string $q) {
        if (!$conn->query($q)) {
            internal_server_error();
        }
    }

    $link = mysqli_connect($servername, $username, $password, $db);
    $conn = new mysqli($servername, $username, $password);
    if ($conn->connect_error) {
        internal_server_error();
    }

    query($conn, "use " . $db);
    query($conn,("INSERT INTO users(username,password,facultyNumber) VALUES (Test,testov,5545)"));


    if (isset($_POST['register'])) {
        
        $username = $_POST['username'];
        $facultyNumber = $_POST['facultyNumber'];
        $password = $_POST['password'];

        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $result = $conn->query("SELECT * FROM users WHERE facultyNumber='" . $id . "'");
        
        if ($result) {
            echo '<p class="error"> Вече съществува потребител с този факултетен номер!</p>';
        } else {
            $query = $conn->query->prepare("INSERT INTO users(username,password,facultyNumber) VALUES (:username,:password_hash,:facultyNumber)");
            $query->bindParam("username", $username, PDO::PARAM_STR);
            $query->bindParam("password_hash", $password_hash, PDO::PARAM_STR);
            $query->bindParam("facultyNumber", $facultyNumber, PDO::PARAM_STR);
            $result = $query->execute();
            if ($result) {
                echo '<p class="success">Успешна регистрация!</p>';
            } else {
                echo '<p class="error">Неуспешна регистрация!</p>';
            }
        }
    }
?>