<?php
class Appointment {
    public $id;
    public $title;
    public $place;
    public $description;
    public $duration;
    public $creator;
    public $times;

    function __construct($id, $ti, $pl, $desc, $dur, $cre) {
        $this->id = $id;
        $this->title = $ti;
        $this->place=$pl;
        $this->description=$desc;
        $this->duration=$dur;
        $this->creator=$cre;
       

      }
}

class Time {
  public $id;
  public $date;
  public $idAppointment;
  public $users;
  

  function __construct($id, $dt, $idAppo) {
      $this->id = $id;
      $this->date = $dt;
      $this->idAppointment= $idAppo;
      $this->users = array();
    }
}

class User {
  public $id;
  public $name;
  public $checked;
  public $comment;
  public $appoTimeId;

  function __construct($id, $name, $ck, $comment, $appoTimeId) {
      $this->id = $id;
      $this->name = $name;
      $this->checked = $ck;
      $this->comment = $comment;
      $this->appoTimeId = $appoTimeId;
  }
}