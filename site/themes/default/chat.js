init = function () {
    chat = document.getElementById("chatbox");
}

onConnect = function () {
    chat.innerHTML = "<i>Connected</i>";
}

onMessage = function (message) {
    message.message = common.message_parse_withemotes(message.message); // graphical emotes
    //message.message = common.message_parse_textonly(message.message); // text emotes
    chat.innerHTML = `<p><b>${message.user.userName}</b> ${message.message}</p>` + chat.innerHTML;
}

onDisconnect = function () {
    chat.innerHTML = "<i>Disconnected. Trying again in 5s</i><br>" + chat.innerHTML;
}
