<?php
    session_start();

    if($_SESSION["userID"]) {
        http_response_code(200);
    } else {
        http_response_code(204);
    }
?>