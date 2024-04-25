<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

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
