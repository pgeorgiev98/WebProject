<?php

    session_start();
    unset($_SESSION["userID"]);
    session_destroy();
    exit();

?>
