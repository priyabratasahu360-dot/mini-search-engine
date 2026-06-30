import { STOP_WORDS } from "../utils/stopwords.js";
import { tokenize } from "../utils/tokenize.js";

export const createIndex = (parsedData) => {
    const text = [
        parsedData.title,
        ...parsedData.paragraphs
    ].join(" ");

   const tokens = tokenize(text)

    const index = {};
    const positions = new Map();

    tokens.forEach((word, position) => {
        index[word] = (index[word] || 0) + 1

        if(!positions.has(word)){
            positions.set(word, []);
        }

        positions.get(word).push(position);
    })

    return {index,positions, documentLength: tokens.length};
}