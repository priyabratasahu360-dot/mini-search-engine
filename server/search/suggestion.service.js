import Page from "../models/page.model.js";

export const getSuggestion = async(query) => {
    const pages = await Page.find();

    const suggestions = new Set();

    for(const page of pages){
        const words =[...page.index.keys()];

        for(const word of words){
            if(word.startsWith(query.toLowerCase())){

                suggestions.add(word);
            }
        }
    }

    return [...suggestions].slice(0, 10);
}