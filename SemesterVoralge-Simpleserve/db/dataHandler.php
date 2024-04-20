<?php
include("./models/appointments.php");
class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getDemoData();
        return $res;
    }

   /* public function queryPersonById($id)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryPersonByName($name)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->lastname == $name) {
                array_push($result, $val);
            }
        }
        return $result;
    }*/

    private static function getDemoData()
    {
        $demodata = [
            [new Appo(1, "Shopping", "Millenium", "Flottflott", 2, "Viki")],
            [new Appo(2, "Eat out", "HotPot", "Bargeld mitnehmen", 3, "Wik")],
            [new Appo(3, "Class", "Technikum", "WebScrpting", 5, "Aichbauer")],
        ];
        return $demodata;
    }
}