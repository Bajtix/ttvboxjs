# Theme Events Documentation

## Global events

### On Connect
No parameters, gets called when connection to COMM is estabilished

```js
onConnect = function() {}
```

### On Disconnect
No parameters, gets called when connection to COMM is lost

```js
onDisconnect = function() {}
```

## Chat

### On Message
Called when a chat message is received.

```js
onMessage = function(message) {}
message = {
    message: the message,
    user: {
        userName: "",//username of the sender
        displayName: "", //display name of the sender
        isMod: false, //is the user a moderator
        isSub: false, //is the user a subscriber
        isFounder: false, //is the user the channel founder
        isBroadcaster: false, //is the user a broadcaster
        color: undefined //user chat color
    }
}
```

## Alertbox

### On Follow'
Called when the broadcaster gets followed by someone

```js
onFollow = function(follow) {}
follow = {
    user: {
        userName: "", //the follower's username,
        displayName: "" //the follower's display name
    }
}
```

### On Bit Cheer
Called when a viewer cheers

```js
onBitcheer = function(cheer) {}
follow = {
    bits: 0, //amount of bits
    isAnonymous: false, //is the user anonymous; if true, user fields are undefined
    user: {
        userName: "", //the username,
        displayName: "" //the display name
    }
}
```

### On Raided
Called when the broadcaster gets raided by another one

```js
onRaided = function(raid) {}
raid = {
    viewers: 0, // amount of viewers of the raid
    raided: {
        userName: "", // user name of the raided broadcaster
        displayName: "" // display name of the raided broadcaster
    },
    raiding: {
        userName: "", // user name of the raiding broadcaster
        displayName: "" // display name of the raiding broadcaster
    }
}
```

### Generic
Intended for use in extensions (TBD, subject to change)

```js
onRaided = function(raid) {}
eventName = "",
eventData = ""
```