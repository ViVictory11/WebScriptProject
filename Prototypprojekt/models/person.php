<?php
class Person {
    public $id;
    public $title;
    public $place;
    public $description;
    public $duration;
    public $creator;
    public $times; // Array zur Speicherung von Time-Objekten

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
  public $votes;
  public $idAppointment;
  public $users; // Array zur Speicherung von User-Objekten
  

  function __construct($id, $dt, $vt, $idAppo) {
      $this->id = $id;
      $this->date = $dt;
      $this->votes=$vt;
      $this->idAppointment= $idAppo;
      $this->users = array(); // Initialisiere das Array für User-Objekte
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