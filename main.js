const express = require('express');
const fs = require('fs');
const url = require('url');
const twitch = require('./twitchapi.js');
const comms = require('./communication.js');
const butil = require('./butil.js');
const tests = require('./tests.js');

const app = express();
const port = 3000;

const httplogger = new butil.Logger("EXPRESS");

//settings and token
var myClientId = "";
var myClientPass = "";

var userId = 0;
var defaultTheme = "default";


function siteError(msg, redirect = "/") {
    return fs.readFileSync('./site/err.html', 'utf8').replace("$MESSAGE$", msg).replace("$REDIRECT$", redirect);
}

//#region legacy
/* LEGACY CODE
app.get('/apiauth', (req, res) => {
    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.token == null) {
        res.redirect("/auth");
        return;
    }
    token = {
        token: urlquery.token,
        user: userId
    };

    fs.writeFileSync("./tokendata", JSON.stringify(token));

    commsStart()
    twitchApiStart();

    res.send("Success! <script>setTimeout(()=>{location.href = 'index.html';},1500)</script>");
});

app.get('/savedauth', (req, res) => {

    if (!fs.existsSync("tokendata")) {
        res.send("No saved token <script>setTimeout(()=>{location.href = 'index.html';},1500)</script>");
        return;
    }

    token = JSON.parse(fs.readFileSync("tokendata", 'utf-8'))


    commsStart()
    twitchApiStart();

    res.send("Success! <script>setTimeout(()=>{location.href = 'index.html';},1500)</script>");
});

app.get('/auth', (req, res) => {
    pg = fs.readFileSync('./site/apiauth.html', 'utf8');
    pg = pg.replace("$CLIENT_ID$", myClientId);

    res.send(pg);
});
function twitchApiStart() {


    //legacy code
    //tokendata = JSON.parse(fs.readFileSync("./tokendata", 'utf-8'));

}*/


//#endregion

app.get('/chat', (req, res) => {
    page = fs.readFileSync('./site/chat/index.html', 'utf8');

    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.theme == null) themeurl = defaultTheme;
    else themeurl = urlquery.theme;

    themeurl = themeurl.replace('<', ' ').replace('>', ' ');

    if (fs.existsSync(`./site/themes/${themeurl}/chat.html`)) {
        theme = fs.readFileSync(`./site/themes/${themeurl}/chat.html`, 'utf8');
        data = page.replace("$CONTENT$", theme)
    } else {
        data = siteError(`The theme ${themeurl} for chat doesn't exist`, "#");
    }

    res.send(data);

});

app.get('/alertbox', (req, res) => {
    page = fs.readFileSync('./site/alertbox/index.html', 'utf8');

    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.theme == null) themeurl = defaultTheme;
    else themeurl = urlquery.theme;

    themeurl = themeurl.replace('<', ' ').replace('>', ' ');

    if (fs.existsSync(`./site/themes/${themeurl}/alertbox.html`)) {
        theme = fs.readFileSync(`./site/themes/${themeurl}/alertbox.html`, 'utf8');
        data = page.replace("$CONTENT$", theme)
    } else {
        data = siteError(`The theme ${themeurl} for alertbox doesn't exist`, "#");
    }

    res.send(data);

});

app.get('/test', (req, res) => {
    urlquery = req.query;
    if (urlquery == null || urlquery.type == null) type = "CONNECT";
    else type = urlquery.type;

    switch (type) {
        case 'CHAT':
            tests.sendTestChat();
            break;
        case 'CONNECT':
            tests.sendTestConnect();
            break;
        case 'BITCHEER':
            tests.sendTestBitCheer();
            break;
        case 'RAID':
            tests.sendTestRaid();
            break;
        case 'RAIDED':
            tests.sendTestRaided();
            break;
        case 'FOLLOW':
            tests.sendTestFollow();
            break;
    }

    res.redirect("/testtoolbox.html");
});

app.get('/themeset', (req, res) => {
    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.theme == null) themeurl = defaultTheme;
    else themeurl = urlquery.theme;

    if (fs.existsSync(`./site/themes/${themeurl}/`)) {
        defaultTheme = themeurl;
        data = siteError("Successfuly changed theme");
    } else {
        data = siteError(`Theme ${themeurl} doesn't exist`);
    }
    saveSettings();
    res.send(data);
});

app.get('/themels', (req, res) => {
    var tresponse = [];
    fs.readdirSync("./site/themes/", 'utf8', true).forEach(element => {

        if (!fs.lstatSync(`./site/themes/${element}`).isDirectory()) return;

        ahtml = fs.existsSync(`./site/themes/${element}/alertbox.html`);
        chtml = fs.existsSync(`./site/themes/${element}/chat.html`);
        isdefault = element == defaultTheme;
        tresponse.push({
            name: element,
            alertbox: ahtml,
            chatbox: chtml,
            default: isdefault
        });
    });
    res.type('application/json');
    res.send(JSON.stringify(tresponse));
});

app.get('/userls', (req, res) => {
    var tresponse = {
        id: userId,
        name: twitch.username
    };

    res.type('application/json');
    res.send(JSON.stringify(tresponse));
});

app.get('/userset', (req, res) => {
    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.name == null) {
        res.send(siteError("Incorrect user name"));
    }
    else
        uname = urlquery.name;

    twitch.findUserByName(uname).then(w => {
        twitch.stop();
        userId = w.id;
        saveSettings();

        res.send(siteError(`Found ID ${w.id}.`));
        twitch.login(myClientId, myClientPass, userId);
    }, w => {
        res.send(siteError(`Could not find user. ${w}`));
    });

});

app.use(express.static("site"));

app.all('*', (req, res) => {
    var rurl = butil.clean(req.url);
    res.send(siteError(`404 The page ${rurl} does not exist`));
})


function addListenersToEvents() {
    twitch.onMessage = msg => {
        messageText = butil.emotify(msg);
        data = {
            user: {
                userName: msg.userInfo.userName,
                displayName: msg.userInfo.displayName,
                isMod: msg.userInfo.isMod,
                isSub: msg.userInfo.isSubscriber,
                isFounder: msg.userInfo.isFounder,
                isBroadcaster: msg.userInfo.isBroadcaster,
                color: msg.userInfo.color
            },
            message: butil.clean(msgtxt),
        };
        comms.send("[c]" + JSON.stringify(data));
    };

    twitch.onFollow = follow => {
        data = {
            type: "FOLLOW",
            user: {
                userName: follow.userName,
                displayName: follow.userDisplayName,
            }
        }
        comms.send("[a]" + JSON.stringify(data));
    }

    twitch.onBitcheer = cheer => {
        data = {
            type: "BITCHEER",
            bits: cheer.bits,
            isAnonymous: cheer.isAnonymous,
            user: {
                userName: cheer.userName,
                displayName: cheer.userDisplayName,
            }
        }
        comms.send("[a]" + JSON.stringify(data));
    }

    twitch.onRaided = raid => {
        data = {
            type: "RAIDED",
            viewers: raid.viewers,
            raided: {
                userName: raid.raidedBroadcasterName,
                displayName: raid.raidedBroadcasterDisplayName
            },
            raiding: {
                userName: raid.raidingBroadcasterName,
                displayName: raid.raidingBroadcasterDisplayName
            }
        }
        comms.send("[a]" + JSON.stringify(data));
    }

    twitch.onRaid = raid => {
        data = {
            type: "RAID",
            viewers: raid.viewers,
            raided: {
                userName: raid.raidedBroadcasterName,
                displayName: raid.raidedBroadcasterDisplayName
            },
            raiding: {
                userName: raid.raidingBroadcasterName,
                displayName: raid.raidingBroadcasterDisplayName
            }
        }
        comms.send("[a]" + JSON.stringify(data));
    }
}

function loadTokenAndSettings() {
    if (fs.existsSync("./token.json")) {
        tkn = fs.readFileSync("./token.json");
        tknp = JSON.parse(tkn);
        myClientId = tknp.clientId;
        myClientPass = tknp.clientSecret;
    } else {
        console.error("error: token.json is missing. Please create a Twitch app (https://dev.twitch.tv/console) and pass the token data in a token.json file");
        process.exit();
    }

    if (fs.existsSync("./settings.json")) {
        tkn = fs.readFileSync("./settings.json");
        tknp = JSON.parse(tkn);
        userId = tknp.user;
        defaultTheme = tknp.theme;
    }
}

function saveSettings() {
    tknp = {
        user: userId,
        theme: defaultTheme
    };

    tkn = JSON.stringify(tknp);

    fs.writeFileSync("./settings.json", tkn);
}

loadTokenAndSettings();


process.on("SIGINT", () => {
    twitch.stop();
    console.log("STOP API SERVICE");
    process.exit();
});

app.listen(port, () => {
    httplogger.log(`STARTING HTTP SERVICE @${port}`);
});

comms.start(port + 1);

twitch.login(myClientId, myClientPass, userId);
addListenersToEvents();