<?php
$dbHost = '127.0.0.1:3306';
$dbUser = 'bif2webscriptinguser';
$dbPass = 'bif2021';
$dbName = 'appofinder';

try {
    $conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    //$conn = new PDO("mysql:host=HOST;dbname=DATABASE", USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'error' => 'Database connection failed'));
    exit;
}

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn->beginTransaction();

    try {
        $title = $_POST['title'];
        $description = $_POST['description'];
        $place = $_POST['place'];
        $duration = $_POST['duration'];
        $creator = $_POST['creator'];

        $sql = "INSERT INTO appo (title, place, description, duration, creator) VALUES (:title, :place, :description, :duration, :creator)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':creator', $creator);

        if ($stmt->execute()) {
            $appId = $conn->lastInsertId();

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
        $conn->rollBack();
        $response['error'] = "Error: " . $e->getMessage();
    }
} else {
    $response['error'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);