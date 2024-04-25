<?php
include('db_config.php');


try {
    $conn = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE, USER, PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

$response = array('success' => false);

if (isset($_POST['formDataArray'])) { 
    $formDataArray = $_POST['formDataArray'];

    foreach ($formDataArray as $formData) {
        $name = $formData['name'];
        $checked = $formData['checked'];
        $comment = $formData['comment'];
        $appoTimeId = $formData['appoTimeId'];

        $sql = "INSERT INTO user (name, checked, comment, appoTimeId) VALUES (:name, :checked, :comment, :appoTimeId)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':checked', $checked);
        $stmt->bindParam(':comment', $comment);
        $stmt->bindParam(':appoTimeId', $appoTimeId);

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Error inserting data into database";
        }
    }
} else {
    $response['error'] = "Missing required parameters";
}

header('Content-Type: application/json');
echo json_encode($response);
