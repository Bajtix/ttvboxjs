init = function () {
    alertbox = document.getElementById("alertboxbox");
    console.log("init");
}

function remove(ntf) {
    if (ntf == alertbox.innerHTML) {
        alertbox.innerHTML = ``;
    }
}

onFollow = function (e) {
    notify("New follower", e.user.displayName)
}

onBitcheer = function (e) {
    var unm = e.isAnonymous ? "Anonymous" : e.user.displayName;
    notify(`${unm} cheered`, `${e.bits} bits`);
}

var notify = function (title, important) {
    var ntf = `<div class='notification'><h3>${title}</h3><h1>${important}</h1></div>`;
    alertbox.innerHTML = ntf;

    setTimeout(remove, 5000, alertbox.innerHTML);
    common.playAudio('/themes/default/notification2.mp3', 0.2, true);
}