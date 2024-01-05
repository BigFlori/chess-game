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
    <title>Sakk - Regisztráció</title>
    <link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="css/authstyle.css">
    <script src="js/alert.js"></script>
</head>

<body class="bg-light">
    <div class="container vh-100 d-flex align-items-center justify-content-center">
        <div class="row g-6">
            <div class="col-md-12 d-flex justify-content-center form-container">
                <form id="registerForm">
                    <h1>Regisztráció</h1>
                    <div class="mb-1">
                        <label for="username" class="form-label">Felhasználónév</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                        <p class="input-info mt-2 d-none">Legalább 3, max 16 karakter hosszú, csak betűk, számok és
                            aláhúzás.
                        </p>
                    </div>
                    <div class="mb-1">
                        <label for="password" class="form-label">Jelszó</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                        <p class="input-info mt-2 d-none">Legalább 8 karakter hosszú, tartalmazzon legalább egy
                            kisbetűt, egy
                            nagybetűt, egy számot és egy speciális karaktert.</p>
                    </div>
                    <div class="mb-3">
                        <label for="repeatPassword" class="form-label">Jelszó újra</label>
                        <input type="password" class="form-control" id="repeatPassword" name="repeatPassword" required>
                    </div>
                    <div class="d-flex justify-content-center mb-1">
                        <button type="submit" class="btn btn-primary" id="register">Regisztráció</button>
                    </div>
                    <p class="text-center mt-3">Van már fiókod? <a href="login.php">Jelentkezz be!</a></p>
                    <div id="alert-container"></div>
                </form>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        const isFormValid = () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const repeatPassword = document.getElementById("repeatPassword").value;

            // Check if any field is empty
            if(username.length === 0 || password.length === 0 || repeatPassword.length === 0) {
                const alert = createAlert("Minden mező kitöltése kötelező!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if username is longer than 3 characters
            if (username.length < 3) {
                const alert = createAlert("A felhasználónév legalább 3 karakter hosszú kell legyen!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if username is shorter than 16 characters
            if (username.length > 16) {
                const alert = createAlert("A felhasználónév maximum 16 karakter hosszú lehet!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if username contains only letters, numbers and underscores
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                const alert = createAlert("A felhasználónév csak betűket, számokat és aláhúzást tartalmazhat!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if password is longer than 8 characters
            if (password.length < 8) {
                const alert = createAlert("A jelszó legalább 8 karakter hosszú kell legyen!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if password contains at least one lowercase letter
            if (!/[a-z]/.test(password)) {
                const alert = createAlert("A jelszónak tartalmaznia kell legalább egy kisbetűt!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if password contains at least one uppercase letter
            if (!/[A-Z]/.test(password)) {
                const alert = createAlert("A jelszónak tartalmaznia kell legalább egy nagybetűt!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if password contains at least one number
            if (!/[0-9]/.test(password)) {
                const alert = createAlert("A jelszónak tartalmaznia kell legalább egy számot!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }
            
            // Check if password contains at least one special character
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                const alert = createAlert("A jelszónak tartalmaznia kell legalább egy speciális karaktert!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }

            // Check if passwords match
            if (password != repeatPassword) {
                const alert = createAlert("A jelszavak nem egyeznek!", "danger");
                document.querySelector("#alert-container").appendChild(alert);
                return false;
            }
            return true;
        }

        document.getElementById("register").onclick = function (event) {
            event.preventDefault();
            document.querySelector("#alert-container").innerHTML = "";
            if (isFormValid()) {
                document.querySelector("#register").disabled = true;
                fetch("registerProcess.php", {
                    method: "POST",
                    body: new FormData(document.querySelector("#registerForm"))
                }).then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error);
                        });
                    }
                    return response.json();
                }).then(data => {
                    document.querySelector("#registerForm").reset();
                    const successAlert = createAlert(data.success, "success");
                    const redirectionAlert = createAlert("Átirányítás...", "info");
                    document.querySelector("#alert-container").appendChild(successAlert);
                    document.querySelector("#alert-container").appendChild(redirectionAlert);
                    setTimeout(() => {
                        window.location.href = "login.php";
                    }, 3000);
                }).catch(error => {
                    const alert = createAlert(error.message, "danger");
                    document.querySelector("#alert-container").appendChild(alert);
                }).finally(() => {
                    document.querySelector("#register").disabled = false;
                });
            } else {
                document.querySelectorAll(".input-info").forEach(element => {
                    element.classList.remove("d-none");
                });
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>