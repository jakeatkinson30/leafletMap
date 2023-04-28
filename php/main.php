<?php

    $border = null;
    $countryCodeIsoA2 = null;
    $countryCodeIsoA3 = null;

    $countryName = null;

    // Assign feature to country borders.
    // $countryBorders = json_decode(file_get_contents("../countryBorders.get.json"), true);

    // foreach ($countryBorders['features'] as $feature) {
    //     if ($feature["properties"]["iso_a2"] ==  $_REQUEST['countryCode']) {
    //         $border = $feature;
    //         break;
    //     }
    // };

    $countryName = $border['properties']['name'];
    $countryNameNoSpace = preg_replace('/\s+/', '%20', $countryName);
    
    $countryCodeA2 = $border['properties']['iso_a2'];
    $countryCodeA3 = $border['properties']['iso_a3'];

?>