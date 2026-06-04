import { STOP_WORDS } from "../utils/stopwords.js";

export const createIndex = (parsedData) => {
    const text = [
        parsedData.title,
        ...parsedData.paragraphs
    ].join(" ");

    const normalizedText = text.toLowerCase();

    const words = normalizedText.split(/\s+/);

   

    const index = {};

    for(const word of words){
        const cleanedWord = word.replace(/[^a-z0-9]/g, "");

        if(!cleanedWord) continue;

        if(STOP_WORDS.includes(cleanedWord)){
        continue;
        }

        if(cleanedWord.length < 2){
            continue;
        }

        if(index[cleanedWord]){
            index[cleanedWord] += 1;
        }
        else{
            index[cleanedWord] = 1;
        }
    }

    return index;
}