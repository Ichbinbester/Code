<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB
$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) die("Verbindung fehlgeschlagen: " . $conn->connect_error);

$action = $_POST['action'] ?? '';
$code = trim($_POST['code'] ?? '');
if (!$code) die("Kein Code übergeben.");

// Lobby abrufen oder anlegen
$stmt = $conn->prepare("SELECT lobby_index FROM lobby WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$stmt->bind_result($lobbyId);
if (!$stmt->fetch()) {
    $stmt->close();
    $insert = $conn->prepare("INSERT INTO lobby (code) VALUES (?)");
    $insert->bind_param("s", $code);
    $insert->execute();
    $lobbyId = $insert->insert_id;
    $insert->close();
} else {
    $stmt->close();
}

// Aktion: Gruppe erstellen
if ($action === "create") {
    $groupName = trim($_POST['group_name'] ?? '');
    if (!$groupName) die("Gruppenname fehlt.");

    // Random 6-stelliger alphanumerischer Code
    $groupcode = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

    // In lobby_groups speichern
    $stmt = $conn->prepare("INSERT INTO lobby_groups (name, groupcode, lobby_index) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $groupName, $groupcode, $lobbyId);
    $stmt->execute();
    $stmt->close();
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

    // Als Spieler (Gruppe) in lobby_players eintragen
    $points = 0;
    $isGroup = 1;
    $playertable = 'lobby_players';
    $playercode         = generateUniqueCode(10, $conn, $playertable);
    $stmt = $conn->prepare("INSERT INTO lobby_players (name, player_code, points, is_group, lobby_index) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiii", $playercode, $groupName, $points, $isGroup, $lobbyId);
    $stmt->execute();
    $stmt->close();

    // Weiterleitung
    echo "<script>
    localStorage.setItem('name', " . json_encode($name) . ");
    localStorage.setItem('code', " . json_encode($code) . ");
    localStorage.setItem('playercode', " . json_encode($playercode) . ");
    window.location.href = '../html/lobby.html?code=" . urlencode($code) . "';
    </script>";
    exit;

}

// Aktion: Gruppe beitreten
if ($action === "join") {
    $groupcode = strtoupper(trim($_POST['groupcode'] ?? ''));
    if (!$groupcode) die("Gruppencode fehlt.");

    // Überprüfen ob Gruppe existiert
    $stmt = $conn->prepare("SELECT name FROM lobby_groups WHERE groupcode = ? AND lobby_index = ?");
    $stmt->bind_param("si", $groupcode, $lobbyId);
    $stmt->execute();
    $stmt->bind_result($groupName);
    if (!$stmt->fetch()) {
        $stmt->close();
        die("Gruppe nicht gefunden oder falscher Code.");
    }
    $stmt->close();

    // Kein DB-Eintrag nötig – Spieler teilt sich die Gruppe
    echo "<script>
  localStorage.setItem('name', " . json_encode($name) . ");
  localStorage.setItem('code', " . json_encode($code) . ");
  localStorage.setItem('playercode', " . json_encode($playercode) . ");
  window.location.href = '../html/lobby.html?code=" . urlencode($code) . "';
    </script>";
    exit;

}

die("Ungültige Aktion.");
