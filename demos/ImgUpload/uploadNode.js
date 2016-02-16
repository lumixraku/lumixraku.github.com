document.addEventListener('DOMContentLoaded', function(e){
    var inputFile = document.querySelector('#multifile');
    var dragZone = document.querySelector('.drag-upload');
    inputFile.addEventListener('change', handleShowImg,false);
    dragZone.addEventListener('dragover', function(e){
        e.preventDefault();
    }, false);
    dragZone.addEventListener('drop', handleShowImg, false);

},false);



function handleShowImg(e){
    e.preventDefault();//必须  dragOver 和 drop 都必须阻止默认
    var files = e.target.files || e.dataTransfer.files;
    for (var i = 0, len = files.length ; i < len ; i++) {
        var f = files[i];
        if(!/image\/*/.test(f.type)){
            continue;
        }
        var reader = new FileReader();
        reader.readAsDataURL(f); //对于图片 将读取成base64的形式
        //通过这样的方式实现向事件中传参
        reader.addEventListener('load', function(e){
            readImg(e, f);
        }, false);
    };
}
function readImg(e, f){
    var url = e.target.result;
    var prelist = document.querySelector('.preview-list');
    var imgElem = createImg(url); //imgElem指  img-preview 这个DOM元素//包括pic-area和 percent
    prelist.appendChild(imgElem);
    var formData = new FormData();
    formData.append('upload', f);
    uploading(imgElem, formData);
}
function createImg(url){
    var imgWrapper = document.createElement('div');
    var picArea = document.createElement('div');
    var percent = document.createElement('div');
    imgWrapper.className += ' img-preview';
    picArea.className += ' pic-area';
    picArea.style.cssText = 'background: url(' + url + '); background-size:100% 100%';
    percent.className = 'percent';
    imgWrapper.appendChild(picArea);
    imgWrapper.appendChild(percent);
    return imgWrapper;
}
function uploading(imgWrapper, formData){
    var xhr = new XMLHttpRequest();
    // 为确保正常执行，必须在调用open()方法之前添加onprogress事件处理程序
    xhr.upload.onprogress = function(e){
        if (e.lengthComputable) {
            var percent = (e.loaded / e.total * 100 | 0) + "%";
            // document.querySelector('.percent-msg').innerHTML += percent;
            imgWrapper.querySelector('.percent').innerText = percent;
        }
    }
    xhr.open("post", "/upload");
    xhr.onload = function(e){
        // document.querySelector('.percent-msg').innerHTML += 'complete';
        console.log('completed' + JSON.stringify(e));
    }
    xhr.send(formData);
}