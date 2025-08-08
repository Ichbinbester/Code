<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB-CONNECTION DETAILS
$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';

$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    die('Datenbankverbindung fehlgeschlagen: ' . $conn->connect_error);
}

$code = trim($_POST['joinCode'] ?? '');
if (!$code) {
    die("Kein Code angegeben.");
}

// Code abrufen
$stmt = $conn->prepare("SELECT create_date, time_left FROM game_codes WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "<h2>Der Buchungscode ist ungültig.</h2>";
    exit;
}

$row = $result->fetch_assoc();
$createDate = $row['create_date'];
$timeLeft = strtotime($row['time_left']) - strtotime('TODAY');

if (is_null($createDate)) {
    // Erste Verwendung des Codes – Instanz starten
    $now = date('Y-m-d H:i:s');
    $update = $conn->prepare("UPDATE game_codes SET create_date = ? WHERE code = ?");
    $update->bind_param("ss", $now, $code);
    $update->execute();
    $update->close();

    // Weiterleitung
    header("Location: ../html/spielstart.html?code=" . urlencode($code));
    // Lobby speichern
    $insert = $conn->prepare("INSERT INTO lobby (code) VALUES (?)");
    $insert->bind_param("s", $code);
    $insert->execute();
    $insert->close();
    exit;
} else {
    // Code wurde bereits verwendet – prüfen ob noch gültig
    $now = new DateTime();
    $start = new DateTime($createDate);
    $elapsed = $now->getTimestamp() - $start->getTimestamp();

    if ($elapsed <= $timeLeft) {
        // Instanz gültig – zulassen
        header("Location: ../html/spielstart.html?code=" . urlencode($code));
        exit;
    } else {
        // Instanz abgelaufen – Code löschen
        $delete_code = $conn->prepare("DELETE FROM game_codes WHERE code = ?");
        $delete_code->bind_param("s", $code);
        $delete_code->execute();
        $delete_code->close();
        // Instanz abgelaufen – Lobby löschen
        $delete_lobby = $conn->prepare("DELETE FROM lobby WHERE code = ?");
        $delete_lobby->bind_param("s", $code);
        $delete_lobby->execute();
        $delete_lobby->close();

        echo "<h2>Die Spiel-Instanz ist abgelaufen.</h2>";
        echo "<p>Der Buchungscode war nur 24 Stunden nach dem Start gültig.</p>";
        echo "<p><a href='../html/schnitzeljagd.html'>Zurück zur Eingabe</a></p>";
        exit;
    }
}
