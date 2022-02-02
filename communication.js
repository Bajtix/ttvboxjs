const WebSocket = require('ws');


let sockets = [];

exports.start = function (port) {
    console.log("STARTING COMMS SERVICE");
    exports.server = new WebSocket.Server({
        port: port
    });


    exports.server.on('connection', function (socket) {
        console.log("comm: new connection");
        sockets.push(socket);

        // When you receive a message, send that message to every socket.
        socket.on('message', function (msg) {
            //sockets.forEach(s => s.send(msg));
            console.log("comm: " + msg);
        });

        // When a socket closes, or disconnects, remove it from the array.
        socket.on('close', function () {
            sockets = sockets.filter(s => s !== socket);
        });
    });

    exports.server.on('error', (s) => {
        console.log(s);
    });
}

exports.send = function (msg) {
    sockets.forEach(s => s.send(msg));
}
