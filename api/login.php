<?php
    session_start();
    include('db_config.php');

    if (isset($_POST['login'])) {
        $facultyNumber = $_POST['facultyNumber'];
        $password = $_POST['password'];

        $query = $connection->prepare("SELECT * FROM users WHERE facultyNumber=:facultyNumber");
        $query->bindParam("facultyNumber", $facultyNumber, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            echo '<p class="error">Въведените парола и фн. са грешни!</p>';
        } else {
            if (password_verify($password, $result['password'])) {
                $_SESSION['user_id'] = $result['id'];
                echo '<p class="success">Успешно влизане!</p>';
            } else {
                echo '<p class="error">Username password combination is wrong!</p>';
            }
        }
    }
?>