<?php
include("./models/appointments.php");
include("db_config.php");

class DataHandler{
    private $mysqli;

    public function __construct() {
        $this->mysqli = new mysqli('127.0.0.1:3306', 'bif2webscriptinguser', 'bif2021', 'appofinder');

        if ($this->mysqli->connect_errno > 0) {
            die('Unable to connect to database [' . $this->mysqli->connect_error . ']');
        }
    }

    public function queryDataFromDatabase() {
        $data = array();
    
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
        $statement->execute();
    
        $result = $statement->get_result();
    
        while ($row = $result->fetch_assoc()) {
            if (!isset($data[$row['appo_id']])) {
                $person = new Appointment(
                    $row['appo_id'],
                    $row['appo_title'],
                    $row['appo_place'],
                    $row['appo_desc'],
                    $row['appo_duration'],
                    $row['appo_creator']
                );
    
                $data[$row['appo_id']] = $person;
            } else {
                $person = $data[$row['appo_id']];
            }
    
            $time = new Time(
                $row['appotime_id'],
                $row['appotime_date'],
                $row['appo_id']
            );
    
            $user = new User(
                $row['user_id'],
                $row['user_name'],
                $row['user_checked'],
                $row['user_comment'],
                $row['user_appoTimeId']
            );
    
            $time->users[] = $user;
            $person->times[] = $time;
        }
    
        return array_values($data);
    }
} 