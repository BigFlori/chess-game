<?php
require_once("config.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if any of the fields are empty
    if (isset($_POST["username"]) && isset($_POST["password"]) && isset($_POST["repeatPassword"])) {
        if (empty($_POST["username"]) || empty($_POST["password"]) || empty($_POST["repeatPassword"])) {
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

    $username = $_POST["username"];
    $password = $_POST["password"];
    $repeatPassword = $_POST["repeatPassword"];

    // Check if username is longer than 3 characters
    if (strlen($username) < 3) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A felhasználónév legalább 3 karakter hosszú kell legyen!"
            )
        );
        exit; // Stop execution
    }

    // Check if username is shorter than 16 characters
    if (strlen($username) > 16) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A felhasználónév maximum 16 karakter hosszú lehet!"
            )
        );
        exit; // Stop execution
    }

    // Check if username contains only letters, numbers and underscores
    if (!preg_match("/^[a-zA-Z0-9_]+$/", $username)) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A felhasználónév csak betűket, számokat és aláhúzást tartalmazhat!"
            )
        );
        exit; // Stop execution
    }

    // Check if username is already taken
    $checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
    $checkStatement = $db->prepare($checkUsernameQuery);
    $checkStatement->execute(array($username));
    $count = $checkStatement->fetchColumn();
    if ($count > 0) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A felhasználónév már foglalt!"
            )
        );
        exit; // Stop execution
    }

    // Check if password is longer than 8 characters
    if (strlen($password) < 8) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A jelszó legalább 8 karakter hosszú kell legyen!"
            )
        );
        exit; // Stop execution
    }

    // Check if password contains at least one lowercase letter
    if (!preg_match("/[a-z]/", $password)) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A jelszónak tartalmaznia kell legalább egy kisbetűt!"
            )
        );
        exit; // Stop execution
    }

    // Check if password contains at least one uppercase letter
    if (!preg_match("/[A-Z]/", $password)) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A jelszónak tartalmaznia kell legalább egy nagybetűt!"
            )
        );
        exit; // Stop execution
    }

    // Check if password contains at least one number
    if (!preg_match("/[0-9]/", $password)) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A jelszónak tartalmaznia kell legalább egy számot!"
            )
        );
        exit; // Stop execution
    }

    // Check if password contains at least one special character
    if (!preg_match("/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/", $password)) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" =>
                "A jelszónak tartalmaznia kell legalább egy speciális karaktert!"
            )
        );
        exit; // Stop execution
    }

    // Check if passwords match
    if ($password !== $repeatPassword) {
        header("HTTP/1.1 400 Bad request");
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "A jelszavak nem egyeznek!"
            )
        );
        exit; // Stop execution
    }

    $password = password_hash($password, PASSWORD_DEFAULT, ["cost" => 12]);

    $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    $statement = $db->prepare($sql);
    $result = $statement->execute(array($username, $password));
    if ($result) {
        $message = "Sikeres regisztráció!";
        header("HTTP/1.1 201 OK");
        http_response_code(201);
        echo json_encode(
            array(
                "success" => "Sikeres regisztráció!"
            )
        );
    } else {
        $message = "Sikertelen regisztráció!";
        header("HTTP/1.1 500 Internal Server Error");
        http_response_code(500);
        echo json_encode(
            array(
                "error" => "Sikertelen regisztráció!"
            )
        );
    }
} else {
    $response = array(
        "message" => "Nem érkezett adat!"
    );
    header("HTTP/1.1 400 Bad request");
    http_response_code(400);
    echo json_encode(
        array(
            "error" => "Nem érkezett adat!"
        )
    );
}
?>