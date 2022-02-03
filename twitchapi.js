

const { ApiClient } = require('twitch');
const { StaticAuthProvider, ClientCredentialsAuthProvider } = require('twitch-auth');
const { DirectConnectionAdapter, EventSubListener } = require('twitch-eventsub');
const { NgrokAdapter } = require('twitch-eventsub-ngrok');
const { ChatClient } = require('twitch-chat-client');

var clientId;
var clientSecret;
var authProvider;
var apiClient;
var clientToken;

var eventListener;


var userId;

exports.login = function (cid, csc, uid, token) {
    console.log("STARTING API SERVICE");
    clientId = cid;
    clientSecret = csc;
    clientToken = token;

    authProvider = new ClientCredentialsAuthProvider(clientId, csc);
    apiClient = new ApiClient({ authProvider });
    userId = uid;

    apiClient.setAccessToken(token);
    apiClient.getTokenInfo().then(w => w.scopes);

    initEventListener();
    initChatClient();

    exports.apiClient = apiClient;
}



exports.stop = function () {
    try {
        stopEventListener();
    } catch (e) {
        console.log(e);
    }
}


var onFollow, onSubscribe, onStreamStart;

async function initEventListener() {
    var adapter = new NgrokAdapter();

    eventListener = new EventSubListener(apiClient, adapter, 'susyamogusy');

    console.log(`Events will be handled for ${userId}`);
    eventListener.listen();



    onStreamStart = await eventListener.subscribeToStreamOnlineEvents(userId, e => {
        console.log(`stream started`);
    });

    onFollow = await eventListener.subscribeToChannelFollowEvents(userId, e => {
        console.log(`${e.userName} just followed!`);
    });

    console.log("Hosting as https://" + await adapter.getHostName());


    // eventListener.subscribeToChannelModeratorAddEvents(userId, e => {
    //     console.log('add mod');
    // });



    console.log("registered events");
}

function stopEventListener() {
    try {
        eventListener.unlisten();
    } catch (e) {
        console.log(e);
    }
}



function initChatClient() {
    exports.chatClient = ChatClient.anonymous({ channels: ['bajtixone'] });
    exports.chatClient.connect().catch(w => {
        console.error(w);
    });
}


