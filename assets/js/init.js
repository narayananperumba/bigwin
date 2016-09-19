window.onload = function() {

    var button = document.getElementById("button");
    var results = document.getElementById("results");
    var button = document.getElementById("button");
    var spinnerC = document.getElementById("spinner-container");
    var spinnerX = document.getElementById("spinnerX");
    var spinnerY = document.getElementById("spinnerY");
    var spinnerZ = document.getElementById("spinnerZ");

    var socket = io.connect('http://localhost:8125');
    results.classList.add("active");
    

    socket.on('spinners', function (data) {
        spinnerC.classList.add("active");
        var imgpath = "assets/img/";
        spinnerX.innerHTML = "<img src='"+imgpath+"Symbol_"+data.spinner.sX+".png'></img>";
        spinnerY.innerHTML = "<img src='"+imgpath+"Symbol_"+data.spinner.sY+".png'></img>";
        spinnerZ.innerHTML = "<img src='"+imgpath+"Symbol_"+data.spinner.sZ+".png'></img>";
    });

    socket.on('result', function (data) {
        results.innerHTML = "<span class="+data.status+">"+data.message+"</span>";
        button.classList.remove("loader");
        
        if(data.bonus == 1){
            button.classList.add("loader");
            results.innerHTML+="<div class='bonus'> You won a bonus point "+ (data.bonusCnt > 1 ? "AGAIN" : "" )+"! Wait for a moment..</div>";
            setTimeout(function(){
                socket.emit("click");
            }, 3500);
        }
        results.classList.add("active");
    });

    button.onclick = function() {
        if(document.getElementsByClassName('button loader').length > 0)
            return;
        results.classList.remove("active");
        spinnerC.classList.remove("active");
        setTimeout(function(){
          socket.emit("click");
      }, 200);
    }
}