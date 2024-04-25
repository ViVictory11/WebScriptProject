<?php
include('db_config.php');

try {
    //Connecting to the database
    $conn = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE, USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    //Throw an error if the connection fails
    echo json_encode(array('success' => false, 'error' => 'Database connection failed'));
    exit;
}

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn->beginTransaction();

    try {
        //Get the data from the POST
        $title = $_POST['title'];
        $description = $_POST['description'];
        $place = $_POST['place'];
        $duration = $_POST['duration'];
        $creator = $_POST['creator'];

        //Prepare, bind and execute the sql-statement so the data will be written correctly into the table in the database
        $sql = "INSERT INTO appo (title, place, description, duration, creator) VALUES (:title, :place, :description, :duration, :creator)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':creator', $creator);

        if ($stmt->execute()) {
            //Get the ID of the inserted line
            $appId = $conn->lastInsertId();

            //The same here again with the dates which will be saved in another table
            foreach ($_POST['date'] as $key => $date) {
                $time = $_POST['time'][$key];
                $dateTime = $date . ' ' . $time;

                $sql = "INSERT INTO appotime (date, appoId) VALUES (:dateTime, :appId)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':dateTime', $dateTime);
                $stmt->bindParam(':appId', $appId);
                $stmt->execute();
            }

            $conn->commit();
            $response['success'] = true;
        } else {
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
