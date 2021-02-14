<?php

    session_start();
    unset($_SESSION["userID"]);
    session_destroy();
    header('Location: ../static/Auth/login.html');
    exit();

?>
