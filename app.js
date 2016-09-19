var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs'),
path = require('path'),
sp = require("./assets/js/spinner").Spinner

app.listen(8125);

function handler(request, response) {

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'applilcation/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    contentType = mimeTypes[extname] || 'application/octect-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, Error: '+error.code+' occured..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    }); 

}

var updateSpinners = function(spinner) {
    io.sockets.emit("spinners", { spinner });
}

io.sockets.on('connection', function (socket) {
    var newSp = new sp();
    var spin = [];
    var bonusCnt = 0;
    socket.on("click", function() {
        spin = newSp.runSpinner();
        updateSpinners(spin);
        if(spin.sB==1)
            bonusCnt+=1;
        else
            bonusCnt = 0;
        setTimeout(function(){showResults(spin,bonusCnt);}, 250);    //show result after 250ms
    });

    socket.on("init", function() {
        spin = newSp.runSpinner();
        updateSpinners(spin);
    });
});

var showResults = function(spin,bonusCnt){
    if(spin.sX == spin.sY && spin.sY == spin.sZ)
        io.sockets.emit("result", { message: "<strong>Big win !!!</strong>", status: "big-win", bonus: spin.sB, bonusCnt: bonusCnt});
    else if(spin.sX == spin.sY || spin.sX == spin.sZ || spin.sY == spin.sZ )
        io.sockets.emit("result", { message: "<strong>Small win !!</strong>", status: "small-win", bonus: spin.sB, bonusCnt: bonusCnt});
    else
        io.sockets.emit("result", { message: "<strong>No win !</strong>", status: "no-win", bonus: spin.sB, bonusCnt: bonusCnt});
    
}

console.log('Server running at http://127.0.0.1:8125/');