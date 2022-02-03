class common {
    static audioLock = 0;

    static audio;

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

    /*
        Plays audio... duh
        @param url Url of the audio file
        @param volume Volume
        @param force whether to force playback, pausing the previous
    */
    static playAudio(url, volume = 0.5, force = false) {
        if (this.audioLock > 0 && !force) return;
        if (this.audio != null) {
            this.audio.pause();
            this.audioLock--;
        }

        this.audio = new Audio(url);
        this.audio.volume = volume;
        this.audio.play();
        this.audioLock++;
        this.audio.onended = () => {
            this.audioLock--;
        };
    }
}