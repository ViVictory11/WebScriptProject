<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            /*case "queryPersons":
                $res = $this->dh->queryPersons();
                break;
            case "queryTimeTime":
                $res = $this->dh->queryTimeTime($param);
                break;*/
            case "queryDataFromDatabase":
                $res = $this->dh->queryDataFromDatabase();
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
