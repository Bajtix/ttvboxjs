var alertbox;



var init = function (e) {

};

var onConnect = function () {

};

var onDisconnect = function () {
    alertbox.innerHTML = `<h1>Disconnected</h1>`;
    setTimeout(() => alertbox.innerHTML = ``, 3000);
};

var onFollow = function (e) {
    alertbox.innerHTML = `<h1>New follower: ${e.user.displayName}</h1>`;
    setTimeout(() => alertbox.innerHTML = ``, 3000);
};

var onBitcheer = function (e) {
    alertbox.innerHTML = `<h1>Bits cheered ${e.bits} bits</h1>`;
    setTimeout(() => alertbox.innerHTML = ``, 3000);
};

var onRaided = function (e) {
    alertbox.innerHTML = `<h1>Getting raided by ${e.raiding.displayName} w/ ${e.viewers} viewers</h1>`;
    setTimeout(() => alertbox.innerHTML = ``, 3000);
};



window.onload = main;

function main() {
    var _socket;
    alertbox = document.getElementById("alertbox");

    init();

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





