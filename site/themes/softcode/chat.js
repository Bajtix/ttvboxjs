var mgid = 0;
onConnect = function () {

    chat = document.getElementById("chatbox");
    chat.innerHTML = `<p class="suc new" id="e${mgid}"><i>Connected</i></p>`;
    mgid++;
    document.getElementById(`e${mgid - 2}`).classList.remove('new')
}

onMessage = function (message) {

    message.message = common.message_parse_textonly(message.message); // text emotes
    chat.innerHTML = `<p id="e${mgid}" class="new"><b class="username">${message.user.userName}</b> <span class="msg">${message.message}</span></p>` + chat.innerHTML;
    mgid++;
    document.getElementById(`e${mgid - 2}`).classList.remove('new')
}

onDisconnect = function () {

    chat = document.getElementById("chatbox");
    chat.innerHTML = `<p class="err new" id="e${mgid}"><i>Disconnected. Trying again in 5s</i></p>` + chat.innerHTML;
    mgid++;
    document.getElementById(`e${mgid - 2}`).classList.remove('new')

}
