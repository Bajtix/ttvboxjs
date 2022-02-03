init = function () {
    alertbox = document.getElementById("alertboxbox");
    console.log("init");
}

onFollow = function (e) {
    alertbox.innerHTML = `<div class='notification'><h3>New follower</h3><h1>${e.user.displayName}</h1></div>`;
    setTimeout(() => alertbox.innerHTML = ``, 5000);
    common.playAudio('/themes/default/notification2.mp3');
}