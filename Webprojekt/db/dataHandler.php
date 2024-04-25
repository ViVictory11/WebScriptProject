<?php
include("./models/appointments.php");
include("db_config.php");

class DataHandler{
    private $mysqli;

    
    public function __construct() { //connecting to the database in the constructor
        $this->mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);

        if ($this->mysqli->connect_errno > 0) {
            die('Unable to connect to database [' . $this->mysqli->connect_error . ']');//proper error message
        }
    }

    public function queryDataFromDatabase() { //here is th queryDataFromDatabase defined
        $data = array(); //an array to save the results
    
        //prepare the JOIN-statement to get data of every connected table in the database
        $statement = $this->mysqli->prepare("
            SELECT a.id AS appo_id, 
                   a.title AS appo_title, 
                   a.place AS appo_place,
                   a.description AS appo_desc, 
                   a.duration AS appo_duration, 
                   a.creator AS appo_creator, 
                   at.id AS appotime_id, 
                   at.date AS appotime_date, 
                   u.id AS user_id, 
                   u.name AS user_name, 
                   u.checked AS user_checked,
                   u.comment AS user_comment,
                   u.appoTimeId AS user_appoTimeId
            FROM appo AS a
            LEFT JOIN appotime AS at ON a.id = at.appoId
            LEFT JOIN user AS u ON at.id = u.appoTimeId
        ");
        //execute the statement
        $statement->execute();
    
        $result = $statement->get_result();
    
        //while there is still a result the loop will continue
        while ($row = $result->fetch_assoc()) {
            if (!isset($data[$row['appo_id']])) { //if the appointment is not in the list create a new object
                $person = new Appointment( //create new Appointment-object and initialize it with the right data
                    $row['appo_id'],
                    $row['appo_title'],
                    $row['appo_place'],
                    $row['appo_desc'],
                    $row['appo_duration'],
                    $row['appo_creator']
                );
    
                $data[$row['appo_id']] = $person; //the object will be added in the array with the right id
            } else {
                $person = $data[$row['appo_id']];
            }
    
            $time = new Time( //create Time-object and initialize it with the right data
                $row['appotime_id'],
                $row['appotime_date'],
                $row['appo_id']
            );
    
            $user = new User( //create User-object and initialize it with the right data
                $row['user_id'],
                $row['user_name'],
                $row['user_checked'],
                $row['user_comment'],
                $row['user_appoTimeId']
            );
    
            $time->users[] = $user; //we add the users to the times so we know which users voted for a time
            $person->times[] = $time; //we add the times to the appointment so we know which times belong to which appointment
        }
    
        return array_values($data);
    }
} 