

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

    initEventListener();
    initChatClient();
}

function initEventListener() {
    var adapter = new NgrokAdapter();

    eventListener = new EventSubListener(apiClient, adapter, 'bardzopodejrzanyfacetwchodzidoventa');

    console.log(`Events will be handled for ${userId}`);
    eventListener.listen();



    eventListener.subscribeToStreamOnlineEvents(userId, e => {
        console.log(`stream started`);
    });

    eventListener.subscribeToChannelFollowEvents(userId, e => {
        console.log(`${e.userName} just followed!`);
    });

    adapter.getHostName().then((e) => console.log("Hosting as https://" + e));


    // eventListener.subscribeToChannelModeratorAddEvents(userId, e => {
    //     console.log('add mod');
    // });



    console.log("registered events");
}

function initChatClient() {
    exports.chatClient = ChatClient.anonymous({ channels: ['bajtixone'] });
    exports.chatClient.connect().catch(w => {
        console.error(w);
    });
}


