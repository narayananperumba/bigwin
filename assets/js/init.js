window.onload = function() {

    var button = document.getElementById("button");
    var results = document.getElementById("results");
    var button = document.getElementById("button");
    var spinnerC = document.getElementById("spinner-container");
    var spinnerX = document.getElementById("spinnerX");
    var spinnerY = document.getElementById("spinnerY");
    var spinnerZ = document.getElementById("spinnerZ");

    var players = [];
    var socket = io();
    var sendButton = document.getElementById("send");
    var name = document.getElementById("name");


    var allUsers = document.getElementById("users");

    //var socket = io.connect('http://localhost:8125');
    results.classList.add("active");
    var clicks =0;
    var dummyData={"spinner":{"sXI":"fr_10.gif","sYI":"fr_11.gif","sZI":"fr_12.gif"}};
    var loop = function (){
        if(clicks == 0){
            button.classList.remove("disable");
            results.innerHTML = "Click to play";
            setImages(dummyData);
            $('.radio').removeAttr('checked');
            $('.radio').parent().css({'background':'transparent'});
        }
        else
            return;
    }

    var setImages = function(data){
        spinnerC.classList.add("active");
        var imgpath = "assets/img/";
        spinnerX.innerHTML = "<img src='"+imgpath+data.spinner.sXI+"'></img>";
        spinnerY.innerHTML = "<img src='"+imgpath+data.spinner.sYI+"'></img>";
        spinnerZ.innerHTML = "<img src='"+imgpath+data.spinner.sZI+"'></img>";
    }
    setImages(dummyData);

    socket.on('spinners', function (data) {
        setImages(data);
    });

    socket.on('result', function (data) {
        results.innerHTML = "<span class="+data.status+">"+data.message+"</span>";
        button.classList.remove("loader");
        
        if(data.bonus == 1){
            button.classList.add("loader");
            results.innerHTML+="<div class='bonus'> You won a bonus point "+ (data.bonusCnt > 1 ? "AGAIN" : "" )+"! Wait for a moment..</div>";
            setTimeout(function(){
                socket.emit("click");
            }, 1500);
        }

        if(players.length>0){
            console.log('player',players);

        for(var i=0; i<players.length; i++) {
            if(players[i].playername.toLowerCase() != 'admin'){
                var rad = $("input[name='"+players[i].id+"']:checked"). val();
                
                if (rad == data.status)
                    $("input[name='"+players[i].id+"']:checked").parent().css({'background':'#4caf50'});
                else
                    $("input[name='"+players[i].id+"']:checked").parent().css({'background':'#ff5722'});
            }
            
            }
        }





        results.classList.add("active");
        setTimeout(function(){
                clicks=0;loop();
            }, 3000);
        clicks=0;
    });


    socket.on('users', function (data) {
        var str ='';
        for(var i=0; i<data.users.length; i++) {
        var user = data.users[i];
        str += '<li>'+user.name +'</li>';
    }

        //allUsers.innerHTML = str;
    });

    button.onclick = function() {
        if(document.getElementsByClassName('button disable').length == 0)
            button.classList.add("disable");
        else
            return;

        if(document.getElementsByClassName('button loader').length > 0)
            return;
        results.classList.remove("active");
        spinnerC.classList.remove("active");
        setTimeout(function(){
          clicks = 1;
          socket.emit("click");
          loop();
      }, 0);
    }

socket.on('addPlayer', function (data) {
        
        if(data.playername) {
            players.push(data);
            
        } else {
            console.log("There is a problem:", data);
        }
    });
socket.on('player', function (data) {
        
        if(data.playername) {
           // players.push(data);
            var admin ='';
            var html = '<div class="tbl-raw"><span>User</span><span>BigWin $10</span><span>SmallWin $5</span><span>NoWin 0</span></div>';

            html += '<div class="tbl-raw"><span><b>' + (data.playername ? data.playername : 'Server') + ': </b></span>';
                html += '<span><input type="radio" class="radio" name="'+data.id+'" value="big-win"/></span>';
                html += '<span><input type="radio" class="radio" name="'+data.id+'" value="small-win"/></span>';
                html += '<span><input type="radio" class="radio" name="'+data.id+'" value="no-win"/></span></div>';

                
            /*for(var i=0; i<players.length; i++) {

                html += '<div class="tbl-raw"><span><b>' + (players[i].playername ? players[i].playername : 'Server') + ': </b></span>';
                html += '<span><input type="radio" class="radio" name="'+players[i].id+'" value="1"/></span>';
                html += '<span><input type="radio" class="radio" name="'+players[i].id+'" value="2"/></span>';
                html += '<span><input type="radio" class="radio" name="'+players[i].id+'" value="3"/></span></div>';

                if (players[i].playername == "admin")
                admin = players[i].playername;
            
            }*/
            if (data.playername.toLowerCase() == 'admin')
                $('.button').show();
            else
            allUsers.innerHTML = html;
            
        } else {
            console.log("There is a problem:", data);
        }
    });
socket.on('clearform', function (data) {
        if(data.playername) {
            $('form').hide();
        } else {
            console.log("There is a problem:", data);
        }
    });


  $('form').submit(function(){ 
    if(name.value == "") {
            alert("Please type your name!");
        } else {
            socket.emit('send', { id: socket.id, playername: name.value });
            
        }    
    return false;
  });
}