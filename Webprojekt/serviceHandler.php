<?php
include("businesslogic/simpleLogic.php");

$method = "";

isset($_GET["method"]) ? $method = $_GET["method"] : false;

$logic = new SimpleLogic();
$result = $logic->handleRequest($method);
if ($result == null) {
    response("GET", 400, null);
} else {
    response("GET", 200, $result);
}

function response($method, $httpStatus, $data)
{
    switch ($method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
