
var express =require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var path = require('path');
var sp = require("./assets/js/spinner").Spinner;
var Moniker = require('moniker');

app.use(express.static(path.join(__dirname, '/')));

http.listen(8888, function(){
  console.log('listening on *:8888');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var updateSpinners = function(spinner) {
    spinner.sXI= "fr_"+spinner.sX+".png";
    spinner.sYI= "fr_"+spinner.sY+".png";
    spinner.sZI= "fr_"+spinner.sZ+".png";
    io.sockets.emit("spinners", { spinner });
}


io.sockets.on('connection', function (socket) {
    var user = addUser();
    var newSp = new sp();
    var spin = [];
    var bonusCnt = 0;

    socket.on('send', function(data){
    io.emit('addPlayer', data);    
    io.to(socket.id).emit('player', data);
    io.to(socket.id).emit('clearform', data);
    });

    socket.on("click", function() {
        spin = newSp.runSpinner();
        updateSpinners(spin);
        if(spin.sB==1)
            bonusCnt+=1;
        else
            bonusCnt = 0;
        setTimeout(function(){showResults(spin,bonusCnt);}, 250);    //show result after 250ms
    });


    socket.on('disconnect', function(){ removeUser(user); });
});

var showResults = function(spin,bonusCnt){
    if(spin.sX == spin.sY && spin.sY == spin.sZ)
        io.sockets.emit("result", { message: "<strong>Big win !!!</strong>", status: "big-win", bonus: spin.sB, bonusCnt: bonusCnt});
    else if(spin.sX == spin.sY || spin.sX == spin.sZ || spin.sY == spin.sZ )
        io.sockets.emit("result", { message: "<strong>Small win !!</strong>", status: "small-win", bonus: spin.sB, bonusCnt: bonusCnt});
    else
        io.sockets.emit("result", { message: "<strong>No win !</strong>", status: "no-win", bonus: spin.sB, bonusCnt: bonusCnt});
    
}


var users = [];

var addUser = function() {
    //name: Moniker.choose(),
    var user = {
        name: Moniker.choose(),
        clicks: 0
    }
    users.push(user);
    updateUsers();
    return user;
}
var removeUser = function(user) {
    for(var i=0; i<users.length; i++) {
        if(user.name === users[i].name) {
            users.splice(i, 1);
            updateUsers();
            return;
        }
    }
}
var updateUsers = function() {
    var str = '';
    /*for(var i=0; i<users.length; i++) {
        var user = users[i];
        str += user.name + '';
    }*/
    io.sockets.emit("users", { users: users });
}

console.log('Server running at http://127.0.0.1:8888/');
