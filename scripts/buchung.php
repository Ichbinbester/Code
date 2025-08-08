<?php
// Debug aktivieren (nur für Entwicklung)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB-CONNECTION DETAILS
$dbHost     = 'sql109.infinityfree.com';
$dbUser     = 'if0_39431367';
$dbPassword = 'IpZ1GSpsQAVfuFM';
$dbName     = 'if0_39431367_napoleon';
$tableName  = 'bookings';
$tableName2  = 'game_codes';

// Verbindung aufbauen
$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    die('Verbindung fehlgeschlagen: ' . $conn->connect_error);
}

// Buchungscode erzeugen
function generateUniqueCode($length = 32, $conn, $tableName) {
    do {
        $code = bin2hex(random_bytes($length / 2));
        $stmt = $conn->prepare("SELECT 1 FROM $tableName WHERE code = ?");
        if (!$stmt) {
            die("Fehler bei Prüfung auf Duplikate: " . $conn->error);
        }
        $stmt->bind_param("s", $code);
        $stmt->execute();
        $stmt->store_result();
    } while ($stmt->num_rows > 0);
    return $code;
}

// Buchungs-Daten übernehmen
$name         = trim($_POST['name']);
$email        = trim($_POST['email']);
$number       = trim($_POST['phone']) ?: null;
$code         = generateUniqueCode(10, $conn, $tableName);

// Buchungsdetails eintragen
$sql = "INSERT INTO $tableName (name, email, number, code)
        VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Fehler beim Vorbereiten: " . $conn->error);
}

$stmt->bind_param("ssss", $name, $email, $number, $code);
$stmt->execute();
$stmt->close();

// Code-Daten übernehmen
$used           = 0;
$time_left      = 235900;
// Code Details eintragen
$sql = "INSERT INTO $tableName2 (code, time_left)
        VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Fehler beim Vorbereiten: " . $conn->error);
}

$stmt->bind_param("ss", $code, $time_left);
$stmt->execute();
$stmt->close(); 

// Connection schließen
$conn->close();
?>
