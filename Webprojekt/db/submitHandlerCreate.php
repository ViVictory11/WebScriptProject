<?php
include('db_config.php'); //including the database-user information file again

try {
    //connecting to the database
    $conn = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE, USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    //throw an error if the connection fails
    echo json_encode(array('success' => false, 'error' => 'Database connection failed'));
    exit;
}

$response = array('success' => false); //again the response with successed set on false

if ($_SERVER["REQUEST_METHOD"] == "POST") { //check if the request is from type POST
    $conn->beginTransaction();

    try {
        //get the data from the POST
        $title = $_POST['title'];
        $description = $_POST['description'];
        $place = $_POST['place'];
        $duration = $_POST['duration'];
        $creator = $_POST['creator'];

        //prepare, bind and execute the sql-statement so the data will be written correctly into the table in the database
        $sql = "INSERT INTO appo (title, place, description, duration, creator) VALUES (:title, :place, :description, :duration, :creator)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':creator', $creator);

        if ($stmt->execute()) {
            //get the ID of the inserted line
            $appId = $conn->lastInsertId();

            //the same again as above with the dates which will be saved in another table
            foreach ($_POST['date'] as $key => $date) {
                $time = $_POST['time'][$key];
                $dateTime = $date . ' ' . $time;

                $sql = "INSERT INTO appotime (date, appoId) VALUES (:dateTime, :appId)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':dateTime', $dateTime);
                $stmt->bindParam(':appId', $appId);
                $stmt->execute();
            }

            $conn->commit(); //end the transaction -> data will be saved in the database
            $response['success'] = true;
        } else {
            $response['error'] = "Error inserting data into appo table";
        }
    } catch (Exception $e) {
        $conn->rollBack(); //if an error accures the transaction will be rolled back so there are no changes in the database
        $response['error'] = "Error: " . $e->getMessage();
    }
} else {
    //proper error message if the request is invalid
    $response['error'] = "Invalid request method";
}

header('Content-Type: application/json'); //tells the browser/client which type of data to expect
echo json_encode($response); //the answer will be transfered back to the client in JSON format
