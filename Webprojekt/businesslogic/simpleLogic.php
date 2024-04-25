<?php
include("db/dataHandler.php");
<<<<<<< HEAD
//creating class that includes dataHandler and uses it as a value
class SimpleLogic
=======

class SimpleLogic //SimpleLogic class is defined
>>>>>>> 8996afb3f3f437ca5c595732854e3b79a4b0bea3
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
