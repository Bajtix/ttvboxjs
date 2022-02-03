const WebSocket = require('ws');
const { Logger } = require('./butil');


let sockets = [];

const commloger = new Logger("COMM");

exports.start = function (port) {
    commloger.log(`STARTING COMMS SERVICE @${port}`)
    exports.server = new WebSocket.Server({
        port: port
    });


    exports.server.on('connection', function (socket) {
        commloger.log(`NEW ${socket.binaryType.toUpperCase()} CONNECTION`)
        sockets.push(socket);

        // When you receive a message, send that message to every socket.
        socket.on('message', function (msg) {
            //sockets.forEach(s => s.send(msg));
            commloger.log(`MSG: ${msg}`)
        });

        // When a socket closes, or disconnects, remove it from the array.
        socket.on('close', function () {
            sockets = sockets.filter(s => s !== socket);
        });
    });

    exports.server.on('error', (s) => {
        commloger.log(`ERR ${msg}`)
    });
}

exports.send = function (msg) {
    sockets.forEach(s => s.send(msg));
}
