exports.clean = function (a) {
    r = a.replace('<', '&lt;').replace('>', '&gt;');
    return r;
}


exports.emotify = function (msg) {
    msgtxt = "";
    msg.parseEmotes().forEach(element => {
        if (element.text != undefined)
            msgtxt += element.text;
        if (element.id != undefined)
            msgtxt += "{" + element.id + "@" + element.name + "}";
    });

    return msgtxt
}

class Logger {
    constructor(name) {
        this.name = name;
    }

    log(msg) {
        console.log(`[${this.name}] ${msg}`);
    }
}

exports.Logger = Logger;