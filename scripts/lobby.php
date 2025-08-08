<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) die(json_encode(["error" => "DB-Verbindung fehlgeschlagen."]));

$code = $_GET['code'] ?? '';
if (!$code) die(json_encode(["error" => "Kein Code angegeben."]));

// Lobby-ID ermitteln
$stmt = $conn->prepare("SELECT lobby_index FROM lobby WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$stmt->bind_result($lobbyId);
if (!$stmt->fetch()) {
    echo json_encode(["solo" => [], "groups" => []]);
    exit;
}
$stmt->close();

// Alle Spieler/Gruppen abrufen
$stmt = $conn->prepare("SELECT name, is_group FROM lobby_players WHERE lobby_index = ?");
$stmt->bind_param("i", $lobbyId);
$stmt->execute();
$result = $stmt->get_result();

$solo = [];
$groups = [];

while ($row = $result->fetch_assoc()) {
    if ($row['is_group']) {
        $groups[] = ["name" => $row['name']];
    } else {
        $solo[] = ["name" => $row['name']];
    }
}

echo json_encode([
    "solo" => $solo,
    "groups" => $groups
]);
