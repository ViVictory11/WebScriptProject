<?php
include("./models/person.php");

class DataHandler{
    private $mysqli;

    public function __construct() {
        $this->mysqli = new mysqli("127.0.0.1:3306", "bif2webscriptinguser", "bif2021", "appofinder");

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
                   at.votes AS appotime_votes, 
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
                $person = new Person(
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
                $row['appotime_votes'],
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


    

    // Methode, um Daten aus der Datenbank abzurufen
    // Methode, um Daten aus der Datenbank abzurufen und als Person-Objekte zurückzugeben
    /*public function queryDataFromDatabase() {
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
                   at.votes AS appotime_votes, 
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
            // Erstelle ein neues Person-Objekt für jede Zeile, die aus der Datenbank abgerufen wird
            $person = new Person(
                $row['appo_id'],
                $row['appo_title'],
                $row['appo_place'],
                $row['appo_desc'],
                $row['appo_duration'],
                $row['appo_creator']
            );
    
            // Erstelle ein neues Time-Objekt für jede Zeile, die aus der Datenbank abgerufen wird
            $time = new Time(
                $row['appotime_id'],
                $row['appotime_date'],
                $row['appotime_votes'],
                $row['appo_id'] // Hier verwenden wir die appo_id, da sie die Verbindung zur appo-Tabelle herstellt
            );
    
            // Erstelle ein neues User-Objekt für jede Zeile, die aus der Datenbank abgerufen wird
            $user = new User(
                $row['user_id'],
                $row['user_name'],
                $row['user_checked'],
                $row['user_comment'],
                $row['user_appoTimeId']
            );
            $time->users[] = $user;

            // Füge das Time-Objekt dem Person-Objekt hinzu
            $person->times[] = $time;
    
            // Füge das Person-Objekt dem $data-Array hinzu, wenn es nicht bereits vorhanden ist
            if (!isset($data[$person->id])) {
                $data[$person->id] = $person;
            }
        }
    
        return array_values($data);
    }*/

    /*
    public function queryDataFromDatabase() {
        $data = array();
    
        $statement = $this->mysqli->prepare("
            SELECT a.id, a.title, a.place, a.duration, a.creator, at.date, at.checked, u.name, u.comment
            FROM appo as a
            LEFT JOIN appotime as at ON a.id = at.appoId
            LEFT JOIN user as u ON at.id = u.appoTimeId
        ");
        $statement->execute();
    
        $result = $statement->get_result();
    
        while ($row = $result->fetch_assoc()) {
            // Erstelle ein neues Person-Objekt für jede Zeile, die aus der Datenbank abgerufen wird
            $person = new Person(
                $row['id'],
                $row['title'],
                $row['place'],
                $row['duration'],
                $row['creator']
            );
            // Füge das Person-Objekt dem $data-Array hinzu
            $data[] = $person;
        }
    
        return $data;
    }
}
    
    /*public function queryDataFromDatabase() {
    $data = array();

    //$statement = $this->mysqli->prepare("SELECT * FROM appo");
    $statement->execute();

    $result = $statement->get_result();

    while ($row = $result->fetch_assoc()) {
        // Create a new Person object for each row retrieved from the database
        $person = new Person($row['id'], $row['title'], $row['place'], $row['duration'], $row['creator']);
        // Add the Person object to the $data array
        $data[] = $person;
    }
    return $data;
}

}

    // You need to write a variable for each field that you are fetching from the select statement in the correct order
    // For eg., if your select statement was like this:
    // SELECT name, COUNT(*) as count, id, email FROM patients
    // Your bind_result would look like this:
    // $statement->bind_result($name, $count, $id, $email);
    // PS: The variable name doesn't have to be the same as the column name
    /*$statement->bind_result($id, $name, $email, $phone);
    while ($statement->fetch()) {
        $data["id"] = $id;
        $data["name"] = $name;
        $data["email"] = $email;
        $data["phone"] = $phone;
    }
    $statement->free_result();

    echo json_encode($data);
}


/*class DataHandler
{
    public function queryPersons()
    {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryTime()
    {
        $res =  $this->getDemoDataTime();
        return $res;
    }
    public function queryTimeTime($idInput)
    {
        $result = array();
        foreach ($this->queryTime() as $val) {
            if ($val[0]->idAppointment == $idInput) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryDataFromDatabase() {
        // Stelle eine Verbindung zur Datenbank her
        $servername = "127.0.0.1:3306";
        $username = "bif2webscriptinguser";
        $password = "bif2021";
        $database = "appofinder";
        $db = new mysqli($servername, $username, $password, $database);
    
        // Überprüfe die Verbindung
        if ($db->connect_error) {
            die("Connection failed: " . $db->connect_error);
        }
    
        // Führe das SQL-Statement aus
        $sql = "SELECT * FROM appo";
        $result = $db->query($sql);
    
        // Verarbeite das Ergebnis
        $data = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
    
        // Schließe die Verbindung zur Datenbank
        $db->close();
        print_r($data);
        return $data;
    }
    

    

    private static function getDemoDataTime()
    {
        $demodata = [
            [new Time(1, "12 October", 0, 1)],
            [new Time(2, "15 January", 0, 1)],
        ];
        return $demodata;
    }
}*/
