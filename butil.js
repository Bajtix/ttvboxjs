exports.clean = function (a) {
    r = a.replace('<', '&lt;').replace('>', '&gt;');
    return r;
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