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
    var ntf = `<div class='notification'><h3>New follower</h3><h1>${e.user.displayName}</h1></div>`;
    alertbox.innerHTML = ntf;

    setTimeout(remove, 5000, alertbox.innerHTML);
    common.playAudio('/themes/default/notification2.mp3', 0.2, true);
}