<?php
session_start();
if (isset($_SESSION["username"])) {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sakk - Bejelentkezés</title>
    <link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="css/authstyle.css">
    <script src="js/alert.js"></script>
</head>

<body class="bg-light">
    <div class="container vh-100 d-flex align-items-center justify-content-center">
        <div class="row g-6">
            <div class="col-md-6 d-flex justify-content-center form-container">
                <form id="loginForm">
                    <h1>Bejelentkezés</h1>
                    <div class="mb-1">
                        <label for="username" class="form-label">Felhasználónév</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Jelszó</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary" id="login">Bejelentkezés</button>
                    </div>
                    <p class="text-center mt-3">Nincs még fiókod? <a href="register.php">Regisztrálj!</a></p>
                    <div id="alert-container"></div>
                </form>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        document.getElementById("login").onclick = function (event) {
            event.preventDefault();
            document.querySelector("#alert-container").innerHTML = "";
            fetch("loginProcess.php", {
                method: "POST",
                body: new FormData(document.querySelector("#loginForm"))
            }).then(response => {
                if(!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
                window.location.href = "index.php";
            }).catch(error => {
                const alert = createAlert(error.message, "danger");
                document.querySelector("#alert-container").appendChild(alert);
            });
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>