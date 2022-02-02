class common {
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
            result = result.replace(element, nm);
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
}