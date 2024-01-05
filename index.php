<?php
session_start();
if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sakk - Webprog</title>
    <link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/board.css" />
</head>

<body>
    <div id="bg-image">
        <div id="overlay">
            <header>
                <p class="text-dark">Bejelentkezve, mint
                    <?php echo $_SESSION["username"] ?>
                </p>
                <form action="logout.php" method="post">
                    <button type="submit">Kijelentkezés</button>
                </form>
            </header>
            <main id="game">
                <div id="game-controls">
                    <button class="btn" id="new-game" role="button">Új játék indítása!</button>
                </div>
                <div class="row-space-between">
                    <h3 id="turn-text"></h3>
                    <h3 id="check-info"></h3>
                </div>
                <div id="game-board"></div>
            </main>
        </div>
    </div>
    <script type="module" src="js/board.js"></script>
</body>

</html>