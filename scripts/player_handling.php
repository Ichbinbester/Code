<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB-Zugang
$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

$name = trim($_POST['name'] ?? '');
$code = trim($_POST['code'] ?? '');

if (!$name || !$code) {
    die("Fehlende Angaben.");
}

$stmt = $conn->prepare("SELECT lobby_index FROM lobby WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$stmt->bind_result($lobbyId);
if (!$stmt->fetch()) {
    $stmt->close();

    // Noch nicht vorhanden → erstellen
    $insert = $conn->prepare("INSERT INTO lobby (code) VALUES (?)");
    $insert->bind_param("s", $code);
    $insert->execute();
    $lobbyId = $insert->insert_id;
    $insert->close();
} else {
    $stmt->close();
}
// Spielercode erzeugen
    function generateUniqueCode($length = 32, $conn, $tableName) {
        do {
            $playercode = bin2hex(random_bytes($length / 2));
            $stmt = $conn->prepare("SELECT 1 FROM $tableName WHERE player_code = ?");
            if (!$stmt) {
                die("Fehler bei Prüfung auf Duplikate: " . $conn->error);
            }
            $stmt->bind_param("s", $playercode);
            $stmt->execute();
            $stmt->store_result();
        } while ($stmt->num_rows > 0);
        return $playercode;
    }
// Spieler eintragen
$points = 0;
$isGroup = 0; // Einzelspieler
$playertable = 'lobby_players';
$playercode         = generateUniqueCode(10, $conn, $playertable);
$insertPlayer = $conn->prepare("INSERT INTO lobby_players (name, player_code, points, is_group, lobby_index) VALUES (?, ?, ?, ?, ?)");
$insertPlayer->bind_param("ssiii", $name, $playercode, $points, $isGroup, $lobbyId);
$insertPlayer->execute();
$insertPlayer->close();

$conn->close();

// Weiterleitung zur Lobby
echo "<script>
  localStorage.setItem('name', " . json_encode($name) . ");
  localStorage.setItem('code', " . json_encode($code) . ");
  localStorage.setItem('playercode', " . json_encode($playercode) . ");
  window.location.href = '../html/lobby.html?code=" . urlencode($code) . "';
</script>";
exit;

