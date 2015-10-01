<?php

$uploaddir = 'img/';
// $src_array=array();
// if(isset($_FILES['files'])){
//     foreach ($_FILES['files']["error"] as $key => $error) {
//         if($error==UPLOAD_ERR_OK){
//             header("Content-Length: ".$_FILES["files"]["size"][$key]);
//             if(!preg_match("#image#",$_FILES["files"]["type"][$key]))continue;
//             $tmp_name = $_FILES["files"]["tmp_name"][$key];
//             $name = $_FILES["files"]["name"][$key];
//             $name= date("YmdHis",time()).preg_replace("#[^\w\.]#","",$name);
//             $uploadfile = $uploaddir.$name;
//             echo $uploadfile;
//             $ret=move_uploaded_file($tmp_name, $uploadfile);
//             if($ret){
//                 $src_array[]=$uploadfile;
//             }
//         }
//     }
// }

header("Content-Length: ".$_FILES["file"]["size"]);
$tmp_name = $_FILES["file"]["tmp_name"];
$name = $_FILES["file"]["name"];
$name= date("YmdHis",time()).preg_replace("#[^\w\.]#","",$name);
$uploadfile = $uploaddir.$name;
$ret=move_uploaded_file($tmp_name, $uploadfile);
echo $tmp_name.'    ';
echo $uploadfile;
echo $_FILES["file"]["size"];
?>
