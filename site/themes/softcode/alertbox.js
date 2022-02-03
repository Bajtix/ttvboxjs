var id = 0;

var die_time = [];

init = function () {
    alertbox = document.getElementById("alertboxbox");
    console.log("init");
}

onFollow = function (e) {
    notif("New follower", e.user.displayName, "")
    common.playAudio('/themes/default/notification1.mp3', 0.5, true);
}

function notif(title, user, message) {
    invalidateAllPrevious();
    alertbox.innerHTML = `<div class='notification' id="${id}">
    <h3>${title}</h3>
    <h1>${user}</h1>
    <p>${message}</p>
    </div>`
        + alertbox.innerHTML;

    die_time[id] = Date.now() + 7000;
    id++;

}

function invalidateAllPrevious() {
    var elements = document.getElementsByClassName("notification");
    if (elements.length > 2) elements.item(2).remove();

    for (i = 0; i < elements.length; i++) {
        t = elements.item(i).id;
        if (die_time[t] < Date.now()) {
            elements.item(i).remove();
            i--;
        }
    }
}

