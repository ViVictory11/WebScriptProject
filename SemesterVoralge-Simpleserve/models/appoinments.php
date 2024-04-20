<?php
class Appo {
    public $idAppo;
    public $title;
    public $place;
    public $description;
    public $duration;
    public $creator;

    function __construct($idAp, $title, $place, $desc, $duration, $creator) {
        $this->idAppo = $idAp;
        $this->title = $title;
        $this->place=$place;
        $this->description=$desc;
        $this->duration=$duration;
        $this->creator=$creator;
      }
}

class AppoTime {
    public $idAppoTime;
    public $dateTime;
    public $checked;
    public $appoId;

    function __construct($idApT, $dateT, $chck, $idAp) {
        $this->idAppoTime = $idApT;
        $this->dateTime = $dateT;
        $this->checked=$chck;
        $this->appoId=$idAp;
      }
}

class User {
    public $idUser;
    public $name;
    public $comment;
    public $appoTimeId;

    function __construct($idU, $nm, $cmm, $idApT) {
        $this->idUser = $idU;
        $this->name = $nm;
        $this->comment=$cmm;
        $this->appoTimeId=$idApT;
      }
}