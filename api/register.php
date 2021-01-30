<?php

    session_start();

    include('db_config');

    if (isset($_POST['register'])) {
        
        $username = $_POST['username'];
        $facultyNumber = $_POST['facultyNumber'];
        $password = $_POST['password'];

        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $query = $connection->prepare("SELECT * FROM users WHERE facultyNumber=:facultyNumber");
        $query->bindParam("facultyNumber", $facultyNumber, PDO::PARAM_STR);
        $query->execute();
        
        if ($query->rowCount() > 0) {
            echo '<p class="error"> Вече съществува потребител с този факултетен номер!</p>';
        }

        if ($query->rowCount() == 0) {
            $query = $connection->prepare("INSERT INTO users(username,password,facultyNumber) VALUES (:username,:password_hash,:facultyNumber)");
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