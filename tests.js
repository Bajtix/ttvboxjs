const { randomInt } = require('crypto');
const comms = require('./communication.js');
const korwin = require('./korwin-gen.js');
const butil = require('./butil.js');

class usr {
    constructor(userName, displayName, isMod, isSub, isFounder, color) {
        this.userName = userName;
        this.displayName = displayName;
        this.isMod = isMod;
        this.isSub = isSub;
        this.isFounder = isFounder;
        this.isBroadcaster = false;
        this.color = color;
    }
}

const users = [
    new usr("bajorzbajor", "Major Bajor z Tureckich Bajor", true, true, false, "red"),
    new usr("KarolWojtyła", "Jan Paweł II", true, false, false, "yellow"),
    new usr("约翰塞纳", "John Xina 约翰塞纳", false, false, false, undefined),
    new usr("disstream", "Norbert 'Dis' Gierczak", false, false, false, undefined),
    new usr("dragster", "League of Legends Player 12", true, false, false, "blue"),
    new usr("bombel", "Bom Bel", true, true, true, undefined),
    new usr("aaaaaaaaaaaaaAAAAAAAAAAaaaaa", "Pain", false, true, false, "red"),
    new usr("simpqueen", "Pokimane", true, false, true, "pink"),
    new usr("ziggy", "Siłka życiem siłka zdrowiem", false, false, false, undefined),
    new usr("デビルワッフル ", "꒰🍰꒱ ¿¡폭포!? 𝙞𝙁𝙪 ;;", false, true, true, "green"),
    new usr("Иван", "Иван любит детей", false, false, false, undefined),
    new usr("justsomearab", "شيخ ثري  ", false, false, false, undefined)
];

function getRandomUser() {
    return users[randomInt(users.length - 1)];
}

function getRandomMessage() {
    return korwin.getRandomKorwinizm().replace("(tfu!)", " {1@:)} ");
}


exports.sendTestConnect = function () {
    data = {
        type: "CONNECT"
    }
    comms.send("[a]" + JSON.stringify(data));
}

exports.sendTestFollow = function () {
    data = {
        type: "FOLLOW",
        user: {
            userName: "Test Username",
            displayName: "Test Displayname",
        }
    }
    comms.send("[a]" + JSON.stringify(data));

}

exports.sendTestChat = function () {
    mgg = getRandomMessage();
    data = {
        user: getRandomUser(),
        message: mgg
    };
    comms.send("[c]" + JSON.stringify(data));

}