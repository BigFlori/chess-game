<?php
require_once("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["username"]) && isset($_POST["password"])) {
        if (empty($_POST["username"]) || empty($_POST["password"])) {
            header("HTTP/1.1 400 Bad request");
            http_response_code(400);
            echo json_encode(
                array(
                    "error" => "Minden mező kitöltése kötelező!"
                )
            );
            exit; // Stop execution
        }
    } else {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "Minden mező kitöltése kötelező!"
            )
        );
        exit; // Stop execution
    }

    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    $sql = "SELECT * FROM users WHERE username = ?";
    $statement = $db->prepare($sql);
    $statement->execute([$username]);
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $authenticated = true;
        session_start();
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $username;
    } else {
        $authenticated = false;
    }

    if ($authenticated) {
        // Redirect to the home page or any other page
        header("HTTP/1.1 200 OK");
        http_response_code(200);
        echo json_encode(
            array(
                "success" => "Sikeres bejelentkezés!"
            )
        );
        exit;
    } else {
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "Ezzel a felhasználónév-jelszó párossal nem létezik felhasználó!"
            )
        );
    }
} else {
    http_response_code(400);
    echo json_encode(
        array(
            "error" => "A kérés típusa nem megfelelő!"
        )
    );
}
?>