const express = require('express');
const fs = require('fs');
const url = require('url');
const twitch = require('./twitchapi.js');
const comms = require('./communication.js');
const butil = require('./butil.js');

const app = express();
const port = 3000;

const myClientId = "mq7xi6y53ndsk98iwomgjwzcv42hy3";
const myClientPass = "7gfv2ko10dmmbam4klsq2snwmcj884";
const userId = 161969141;


function siteError(msg) {
    return fs.readFileSync('./site/err.html', 'utf8').replace("$MESSAGE$", msg);
}


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


app.get('/chat', (req, res) => {
    // if (req.url.indexOf('chat/') == undefined) {
    //     res.redirect(res.url.replace('/chat', '/chat/'));
    //     return;
    // }


    page = fs.readFileSync('./site/chat/index.html', 'utf8');

    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.theme == null) themeurl = "default";
    else themeurl = urlquery.theme;

    themeurl = themeurl.replace('<', ' ').replace('>', ' ');

    if (fs.existsSync(`./site/themes/${themeurl}/chat.html`)) {
        theme = fs.readFileSync(`./site/themes/${themeurl}/chat.html`, 'utf8');
        data = page.replace("$CONTENT$", theme)
    } else {
        data = siteError(`Theme ${themeurl} doesn't exist`);
    }

    res.send(data);

});

app.get('/alertbox/', (req, res) => {
    // if (req.url.indexOf('alertbox/') == undefined) {
    //     res.redirect(res.url.replace('/alertbox', '/alertbox/'));
    //     return;
    // }


    page = fs.readFileSync('./site/alertbox/index.html', 'utf8');

    urlquery = url.parse(req.url, true).query;
    if (urlquery == null || urlquery.theme == null) themeurl = "default";
    else themeurl = urlquery.theme;

    themeurl = themeurl.replace('<', ' ').replace('>', ' ');

    if (fs.existsSync(`./site/themes/${themeurl}/alertbox.html`)) {
        theme = fs.readFileSync(`./site/themes/${themeurl}/alertbox.html`, 'utf8');
        data = page.replace("$CONTENT$", theme)
    } else {
        data = siteError(`Theme ${themeurl} doesn't exist`);
    }

    res.send(data);

});

app.use(express.static("site"));


app.listen(port, () => {
    console.log(`Server app listening on port ${port}`);
});



function commsStart() {
    comms.start(3001);
}

process.on("SIGINT", () => {
    twitchApiStop();
});


function twitchApiStart() {
    tokendata = JSON.parse(fs.readFileSync("./tokendata", 'utf-8'));

    twitch.login(myClientId, myClientPass, tokendata.user, tokendata.token);
    twitch.chatClient.onMessage(async (channel, user, message, msg) => {

        msgtxt = "";
        msg.parseEmotes().forEach(element => {
            if (element.text != undefined)
                msgtxt += element.text;
            if (element.id != undefined)
                msgtxt += "{" + element.id + "@" + element.name + "}";
        });
        obj = {
            user: {
                userName: msg.userInfo.userName,
                displayName: msg.userInfo.displayName,
                isMod: msg.userInfo.isMod,
                isSub: msg.userInfo.isSubscriber,
                isFounder: msg.userInfo.isFounder,
                isBroadcaster: msg.userInfo.isBroadcaster
            },
            message: butil.clean(msgtxt),
        };

        m = JSON.stringify(obj);

        console.log(m);
        comms.send("[c]" + m);
    });
}

function twitchApiStop() {
    twitch.stop();
    console.log("STOP API SERVICE");
}
