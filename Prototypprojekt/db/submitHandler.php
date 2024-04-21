<?php
// Get data from POST request
$userName = $_POST['userName'];
$appoTimeId = $_POST['appoTimeId'];
$checked = isset($_POST['checked']) ? ($_POST['checked'] == "true" ? 1 : 0) : 0; // Convert string to boolean
$comment = $_POST['comment'];

// Database connection parameters
$dbHost = '127.0.0.1:3306';
$dbUser = 'bif2webscriptinguser';
$dbPass = 'bif2021';
$dbName = 'appofinder';

// Establish database connection
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare and bind statement
$stmt = $conn->prepare("INSERT INTO user (name, checked, comment, appoTimeId) VALUES (?, ?, ?, ?)");
$stmt->bind_param("siss", $userName, $checked, $comment, $appoTimeId);

// Execute the statement
if ($stmt->execute()) {
    // Data inserted successfully
    echo "Data received and saved successfully.";
} else {
    // Error in executing the statement
    echo "Error: " . $stmt->error;
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
