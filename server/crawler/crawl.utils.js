export const normalizeUrl = (baseUrl, link) => {
    try{
        const url = new URL(link, baseUrl);

        //remove hash fragments
        url.hash = "";

        //remove slash
        let normalized = url.href.replace(/\/$/, "");

        //remove common query params
        normalized = normalized.replace(
            /\?(utm_[^=]+=[^&]+&?)*/g, ""
        );

        //block non-HTML resources

        const blockedExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".svg",
            ".zip",
            ".mp3",
            ".mp4"
        ];

        const isBlocked = blockedExtensions.some(
            ext => normalized.endsWith(ext)
        )

        if(isBlocked){
            return null
        }

        // block mailto/javascript links
        if(normalized.startsWith("mailto:") || normalized.startsWith("javascript:")){
            return null
        }

        return normalized;
    }
    catch(error){
        return null
    }
}