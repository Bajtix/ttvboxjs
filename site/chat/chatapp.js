var chat;

var init = function () {

}

var onMessage = function (message) {
    message.message = common.message_parse_withemotes(message.message);
    chat.innerHTML = `<p><b>${message.user.userName}</b> ${message.message}</p>` + chat.innerHTML;
};

var onConnect = function () {
    chat.innerHTML = `<i>Connected</i><br>`;
};

var onDisconnect = function () {
    chat.innerHTML = `<i>Disconnected. Reconnecting in 5s</i><br>` + chat.innerHTML;
};


window.onload = main;


function main() {
    var _socket;
    chat = document.getElementById("chat");

    init();

    _socket = new WebSocket("ws://localhost:3001");

    _socket.onopen = function (e) {
        console.log("Estabilished a connection");
        onConnect();
    };

    _socket.onmessage = function (event) {
        if (!event.data.startsWith('[c]')) return;
        data = event.data.substr(3);
        obj = JSON.parse(data);
        console.log(`Data received from server: ${obj}`);
        onMessage(obj);
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





