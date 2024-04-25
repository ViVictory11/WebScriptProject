<?php
include("db/dataHandler.php");
class SimpleLogic //SimpleLogic class is defined
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler(); //create Datahandler-Object 
    }
    //function for usage of any functions for database (easily expendable)
    function handleRequest($method)
    {
        switch ($method) {
            case "queryDataFromDatabase":
                $res = $this->dh->queryDataFromDatabase(); //if the method is queryDataFromDatabase the 
                //queryDataFromDatabase from DataHandler is called.
                break; 
            default:
                $res = null; //if any other function is in $method then null is returned
                break;
        }
        return $res;
    }
}
