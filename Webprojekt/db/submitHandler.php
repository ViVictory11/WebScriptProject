<?php
include('db_config.php'); //include the file with the database-user information

try { //trying to connect to the database with PDO (PHP Data Object - library)
    $conn = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE, USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) { //an error message if the connection fails
    echo "Connection failed: " . $e->getMessage();
}

$response = array('success' => false); //create an array to save the AJAX-response; set success to false

if (isset($_POST['formDataArray'])) { //checks if there is any data sent from the form
    $formDataArray = $_POST['formDataArray'];
    //if there is data loop through it and insert it into the database
    foreach ($formDataArray as $formData) {
        //variables are created and filled with the right values from the row of formDataArray
        $name = $formData['name'];
        $checked = $formData['checked'];
        $comment = $formData['comment'];
        $appoTimeId = $formData['appoTimeId'];
        //prepare and bind sql-statement
        $sql = "INSERT INTO user (name, checked, comment, appoTimeId) VALUES (:name, :checked, :comment, :appoTimeId)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':checked', $checked);
        $stmt->bindParam(':comment', $comment);
        $stmt->bindParam(':appoTimeId', $appoTimeId);
        //if the execution of the statement worked, the succes is switched to true
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            //else there will be an error message
            $response['error'] = "Error inserting data into database";
        }
    }
} else {
    $response['error'] = "Missing required parameters";
}

header('Content-Type: application/json'); //tell the browser/client which type of data to expect
echo json_encode($response); //the answer will be transfered back to the client in JSON format
