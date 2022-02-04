var audioSource;

class common {
    /**
     * Parses an emote string inserting text forms of the emotes
     * @param {String} message 
     * @returns The parsed message with <span> emotes
     */
    static message_parse_textonly(message) {
        const idsl = /(?<={).+?(?=@)/g
        const nmsl = /(?<=@).+?(?=})/g
        const fsl = /{.+?(?=})}/g

        let matches = message.match(fsl);
        if (matches == null) return message;

        let result = message;

        matches.forEach((element, index) => {
            console.log(`filtering ${element} @ ${index}`);
            let nm = element.match(nmsl);
            console.log("found " + nm);
            result = result.replace(element, `<span class="emote">${nm}</span>`);
        });

        return result;
    }


    /**
     * Parses an emote string inserting image forms of the emotes
     * @param {String} message 
     * @returns The parsed message with <img> emotes
     */
    static message_parse_withemotes(message) {
        const idsl = /(?<={).+?(?=@)/g
        const nmsl = /(?<=@).+?(?=})/g
        const fsl = /{.+?(?=})}/g

        let matches = message.match(fsl);
        if (matches == null) return message;

        let result = message;

        matches.forEach((element, index) => {
            console.log(`filtering ${element} @ ${index}`);
            let id = element.match(idsl);
            result = result.replace(element, `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/2.0" class="emote" />`);
        });

        return result;
    }



    /**
     * Plays audio... duh
     * @param {String} url Url of the audio file
     * @param {Number} volume Volume
     * @param {Boolean} force whether to force playback, pausing the previous
    */
    static playAudio(url, volume = 0.5, force = false) {
        if (audioSource != null) {
            if (!audioSource.paused && force)
                audioSource.pause();
            else if (!force) return;
        }

        audioSource = new Audio(url);
        audioSource.volume = volume;
        audioSource.play();
    }
}