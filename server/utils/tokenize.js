import { STOP_WORDS } from "./stopwords.js";

const RESERVED_WORDS = new Set([
    "__proto__",
    "prototype",
    "constructor"
]);

export const tokenize = (text) => {
    const words = text.toLowerCase().split(/\s+/);

    const tokens = [];
    for(const rawWord of words){
        const cleanedWord = rawWord.replace(/[^a-z0-9]/g, "");

        if(!cleanedWord) continue;

        if(STOP_WORDS.includes(cleanedWord)) continue;

        if(RESERVED_WORDS.has(cleanedWord)) continue;

        if(cleanedWord.length < 2) continue;

        tokens.push(cleanedWord);
    }

    return tokens;
}