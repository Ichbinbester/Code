<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$dbHost = 'sql109.infinityfree.com';
$dbUser = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName = 'if0_39431367_napoleon';
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) die(json_encode(["error" => "DB-Verbindung fehlgeschlagen"]));

$code = $_POST['code'] ?? '';
if (!$code) die(json_encode(["error" => "Kein Code angegeben."]));

$stmt = $conn->prepare("SELECT lobby_index FROM lobby WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$stmt->bind_result($lobbyId);
if (!$stmt->fetch()) die(json_encode(["error" => "Lobby nicht gefunden."]));
$stmt->close();

// Alle Spieler abrufen
$stmt = $conn->prepare("SELECT name FROM lobby_players WHERE lobby_index = ?");
$stmt->bind_param("i", $lobbyId);
$stmt->execute();
$result = $stmt->get_result();

$players = [];
while ($row = $result->fetch_assoc()) {
    $players[] = $row['name'];
}
echo json_encode(["players" => $players]);
