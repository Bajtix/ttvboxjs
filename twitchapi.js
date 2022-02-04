
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ChatClient } = require("@twurple/chat");
const { EventSubListener } = require("@twurple/eventsub");
const { NgrokAdapter } = require("@twurple/eventsub-ngrok");
const { ApiClient } = require("@twurple/api");
const { Logger } = require("./butil.js");

var clientId = '';
var clientSecret = '';

var authProvider;
var userId = 0;

var chatClient, listener;
var apiClient;

const esublogger = new Logger("EVENTSUB");
const chatlogger = new Logger("CHAT");
const generallogger = new Logger("TWITCH");

exports.onMessage = function (e) { };
exports.onFollow = function (e) { };
exports.onStreamStarted = function (e) { };
exports.onRaid = function (e) { };
exports.onRaided = function (e) { };
exports.onStreamFinished = function (e) { };
exports.onBitcheer = function (e) { };
exports.username = "UNDEFINED";
exports.displayname = "UNDEFINED";


exports.login = function (_clientId, _clientSecret, _userId) {
    generallogger.log(`INITIALIZING STUFF FOR USER ${_userId}`)
    userId = _userId;
    clientId = _clientId;
    clientSecret = _clientSecret;
    authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    apiClient = new ApiClient({ authProvider });
    apiClient.eventSub.deleteAllSubscriptions();

    authProvider.getAccessToken().then(w => {
        generallogger.log(JSON.stringify(w));
    })


    generallogger.log(`SYNC STUFF DONE`)

    exports.findUserByName = function (name) {
        return apiClient.users.getUserByName(name);
    }

    if (userId == 0) {
        generallogger.log("THE USERID IS 0, USER NOT SET. EVENTS ARE IGNORED");
        return;
    }
    initializeChat();
    initializeEventSub();
    generallogger.log("INIT DONE");
}

async function initializeEventSub() {
    listener = new EventSubListener({
        apiClient,
        adapter: new NgrokAdapter(),
        secret: 'czemuNiebuJestemZajaranyen'
    });
    listener.listen();


    await listener.subscribeToStreamOnlineEvents(userId, e => {
        exports.onStreamStarted(e);
    });
    esublogger.log("REGISTER STREAMSTART EVENT")

    await listener.subscribeToStreamOfflineEvents(userId, e => {
        exports.onStreamFinished(e);
    });
    esublogger.log("REGISTER STREAMSTOP EVENT")

    await listener.subscribeToChannelRaidEventsTo(userId, e => {
        exports.onRaided(e);
    });
    esublogger.log("REGISTER RAIDED EVENT")

    await listener.subscribeToChannelRaidEventsFrom(userId, e => {
        exports.onRaid(e);
    });
    esublogger.log("REGISTER RAID EVENT")

    await listener.subscribeToChannelCheerEvents(userId, e => {
        exports.onBitcheer(e);
    });
    esublogger.log("REGISTER BITCHEER EVENT")

    await listener.subscribetochannel

    await listener.subscribeToChannelFollowEvents(userId, e => {
        exports.onFollow(e);
        esublogger.log("FOLLOW EVENT: " + e.userName);
    });
    esublogger.log("REGISTER FOLLOW EVENT")
}

async function initializeChat() {
    let user = await apiClient.users.getUserById(userId);
    exports.username = user.name;
    exports.displayname = user.displayName;


    chatClient = new ChatClient({ channels: [user.name] });
    await chatClient.connect();

    await chatClient.onMessage(async (channel, user, message, msg) => {
        exports.onMessage(msg);
    });
    chatlogger.log("REGISTER MESSAGE EVENT")
}

exports.stop = function () {
    generallogger.log("STOPPING TWITCH SERVICE")
    apiClient.eventSub.deleteAllSubscriptions();
    if (listener != null)
        listener.unlisten();
}
