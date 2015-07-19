<?php

$uploaddir = 'img/';
$src_array=array();

if(isset($_FILES['files'])){
    foreach ($_FILES['files']["error"] as $key => $error) {
        if($error==UPLOAD_ERR_OK){
            if(!preg_match("#image#",$_FILES["files"]["type"][$key]))continue;
            if($_FILES["files"]["size"][$key]>1024*400)continue;
            $tmp_name = $_FILES["files"]["tmp_name"][$key];
            $name = $_FILES["files"]["name"][$key];
            $name= date("YmdHis",time()).preg_replace("#[^\w\.]#","",$name);
            $uploadfile = $uploaddir.$name;
            $ret=move_uploaded_file($tmp_name, $uploadfile);
            if($ret){
                $src_array[]=$uploadfile;
            }
        }
    }
}
echo json_encode($src_array);
