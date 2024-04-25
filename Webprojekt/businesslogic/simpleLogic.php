<?php
include("db/dataHandler.php");
//creating class that includes dataHandler and uses it as a value
class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }
    //function for usage of any functions for database (easily expendable)
    function handleRequest($method)
    {
        switch ($method) {
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
