<?php

require_once 'simplexlsx/simplexlsx.class.php';

if(isset($_POST) == true){
    //generate unique file name
    $fileName = time().'_'.basename($_FILES["file"]["name"]);
    
    //file upload path
    $targetDir = "upload/";
    $targetFilePath = $targetDir . $fileName;
    
    //allow certain file formats
    $fileType = pathinfo($targetFilePath,PATHINFO_EXTENSION);
    $allowTypes = array('xlsx');
    
    if(in_array($fileType, $allowTypes)){
        //upload file to server
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)){


          if ( $xlsx = SimpleXLSX::parse($targetFilePath) ) {
              $response['body'] = $xlsx -> rows();

          } else {
            echo SimpleXLSX::parse_error();
          }

            $response['status'] = 'ok';
        }else{
            $response['status'] = 'err';
        }
    }else{
        $response['status'] = 'type_err';
    }
    
    //render response data in JSON format
    echo json_encode($response);
    unset($targetFilePath);
}

?>