var alertbox;

var onConnect = function () {
    alertbox.innerHTML = `<i>Connected</i><br>`;
};

var onDisconnect = function () {
    alertbox.innerHTML = `<i>Disconnected. Reconnecting in 5s</i><br>` + alertbox.innerHTML;
};

var onFollow = function (e) {
    alertbox.innerHTML = `A new follower: ${e.user.displayName}`;
};

window.onload = main;

function main() {
    var _socket;
    alertbox = document.getElementById("alertbox");

    _socket = new WebSocket("ws://localhost:3001");

    _socket.onopen = function (e) {
        console.log("Estabilished a connection");
        onConnect();
    };

    _socket.onmessage = function (event) {
        if (!event.data.startsWith('[a]')) return;
        data = event.data.substr(3);
        obj = JSON.parse(data);
        console.log(`Data received from server: ${obj}`);
        type = String(obj.type);
        methodName = "on" + type.toUpperCase()[0] + type.toLowerCase().substr(1);

        window[methodName](obj);
    };

    _socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log("Connection died");
        }
        setTimeout(() => main(), 5000);
        onDisconnect();
    };

    _socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };
}





