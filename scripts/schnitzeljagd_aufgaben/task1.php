<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB-Verbindung
$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Eingaben lesen
$name = trim($_POST['name'] ?? '');
$code = trim($_POST['code'] ?? '');
$playercode = trim($_POST['playercode'] ?? '');
$usedTip = ($_POST['usedTip'] ?? '0') === '1';
$action = $_POST['action'] ?? '';

if (!$name || !$code || !$playercode || !$action) {
    die("Fehlende Angaben.");
}

// Aktuellen Punktestand & lobby_index abrufen
$stmt = $conn->prepare("
    SELECT lp.points, lp.lobby_index 
    FROM lobby_players lp
    JOIN lobby l ON lp.lobby_index = l.lobby_index
    WHERE lp.player_code = ? AND l.code = ?
");
$stmt->bind_param("ss", $playercode, $code);
$stmt->execute();
$stmt->bind_result($currentPoints, $lobbyIndex);
if (!$stmt->fetch()) {
    die("Spieler nicht gefunden.");
}
$stmt->close();

// Punkte berechnen
if ($action === 'giveup') {
    $added = 20;
} elseif ($action === 'solve') {
    $added = $usedTip ? 60 : 70;
} else {
    $added = 0;
}

$newPoints = $currentPoints + $added;

// Punktestand aktualisieren
$update = $conn->prepare("
    UPDATE lobby_players 
    SET points = ? 
    WHERE player_code = ? AND lobby_index = ?
");
$update->bind_param("isi", $newPoints, $playercode, $lobbyIndex);
$update->execute();
$update->close();

$conn->close();

header("Location: /html/schnitzeljagd_aufgaben/task2/task2.html?i=2&code=$code&player=$name&playercode=$playercode");
exit;
