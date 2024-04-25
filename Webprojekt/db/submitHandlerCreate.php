<?php
include('db_config.php');
/*$dbHost = '127.0.0.1:3306';
$dbUser = 'bif2webscriptinguser';
$dbPass = 'bif2021';
$dbName = 'appofinder';*/

try {
    // Verbindung zur Datenbank herstellen
    //$conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $conn = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE, USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Fehlermeldung senden, wenn die Verbindung fehlschlägt
    echo json_encode(array('success' => false, 'error' => 'Database connection failed'));
    exit;
}

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn->beginTransaction();

    try {
        // Daten aus dem POST-Array abrufen
        $title = $_POST['title'];
        $description = $_POST['description'];
        $place = $_POST['place'];
        $duration = $_POST['duration'];
        $creator = $_POST['creator'];

        // SQL-Statement vorbereiten und Parameter binden
        $sql = "INSERT INTO appo (title, place, description, duration, creator) VALUES (:title, :place, :description, :duration, :creator)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':creator', $creator);

        // SQL-Statement ausführen
        if ($stmt->execute()) {
            // ID des eingefügten Datensatzes abrufen
            $appId = $conn->lastInsertId();

            // Durchlaufe alle Datums- und Zeitdaten und füge sie zur Datenbank hinzu
            foreach ($_POST['date'] as $key => $date) {
                $time = $_POST['time'][$key];
                $dateTime = $date . ' ' . $time;

                // SQL-Statement für die Zeitdaten vorbereiten und Parameter binden
                $sql = "INSERT INTO appotime (date, appoId) VALUES (:dateTime, :appId)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':dateTime', $dateTime);
                $stmt->bindParam(':appId', $appId);
                $stmt->execute();
            }

            // Transaktion abschließen und Erfolgsmeldung setzen
            $conn->commit();
            $response['success'] = true;
        } else {
            // Fehlermeldung setzen, wenn das Einfügen in die Datenbank fehlschlägt
            $response['error'] = "Error inserting data into appo table";
        }
    } catch (Exception $e) {
        // Bei einem Fehler die Transaktion zurückrollen und Fehlermeldung setzen
        $conn->rollBack();
        $response['error'] = "Error: " . $e->getMessage();
    }
} else {
    // Fehlermeldung setzen, wenn die Anfrage ungültig ist
    $response['error'] = "Invalid request method";
}

// Header für JSON-Antwort setzen und Antwort senden
header('Content-Type: application/json');
echo json_encode($response);
