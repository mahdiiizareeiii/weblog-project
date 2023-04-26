document.getElementById("").onclick = function(){
    let xhttp = new XMLHttpRequest();

    const selectedImage = document.getElementById("selectedImage");
    const imageStatus = document.getElementById("imageStatus");
    const progressDiv = document.getElementById("progressDiv");
    const progressBar = document.getElementById("progressBar");
    const uploadResult = document.getElementById("uploadResult");

    // xhttp.responseType = "json";
    
    xhttp.onreadystatechange = function(){
        if(xhttp.status === 200){
            imageStatus.innerHTML = "اپلود عکس با موفقیت انجام شد";
            uploadResult.innerHTML = this.responseText;
            selectedImage.value = "";
        } else {
            imageStatus.innerHTML = this.responseText;
        }
    };

    xhttp.open("POST", "/dashboard/image-upload");
    xhttp.upload.onprogress = function(e){
        if(e.lengthComputable){
            console.log(e.loaded);
            console.log(e.total);
            let result = Math.floor(e.loaded / e.total) *100;
            // console.log(result + "%");
            if(result!==100){
                progressBar.innerHTML = result + "%";
                progressBar.style = "width:" + result + "%";
            }else {
                progressDiv.style = "display: none";
            }
        }
    };

    let formData = new FormData();
    if(selectedImage.files.length > 0){
        progressDiv.style = "display: block";
        formData.append("image", selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
    }
};