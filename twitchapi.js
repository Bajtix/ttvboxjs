
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

exports.onChatMessage = function (e) { };
exports.onFollow = function (e) { };
exports.onStreamStarted = function (e) { };


exports.login = function (_clientId, _clientSecret, _userId) {
    userId = _userId;
    clientId = _clientId;
    clientSecret = _clientSecret;
    authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    apiClient = new ApiClient({ authProvider });
    apiClient.eventSub.deleteAllSubscriptions();
    initializeChat();
    initializeEventSub();
}

async function initializeEventSub() {
    listener = new EventSubListener({
        apiClient,
        adapter: new NgrokAdapter(),
        secret: 'czemuNiebuJestemZajaranyen'
    });
    listener.listen();

    await listener.subscribeToChannelFollowEvents(userId, e => {
        exports.onFollow(e);
    });
    console.log("EVENTSUB REGISTER FOLLOW");

    await listener.subscribeToStreamOnlineEvents(userId, e => {
        exports.onStreamStarted(e);
    });
    console.log("EVENTSUB REGISTER STREAMSTART");



}

async function initializeChat() {
    let user = await apiClient.users.getUserById(userId);
    chatClient = new ChatClient({ channels: [user.name] });
    await chatClient.connect();

    await chatClient.onMessage(async (channel, user, message, msg) => {
        exports.chatMessage(msg)
    });
    console.log("CHAT REGISTER MESSAGE");

}

exports.stop = function () {
    apiClient.eventSub.deleteAllSubscriptions();
    listener.unlisten();
}
