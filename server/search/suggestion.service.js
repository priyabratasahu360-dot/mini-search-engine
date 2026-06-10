import Suggestion from "../models/suggestion.model.js";

export const getSuggestion = async(query) => {

    if(query.length < 2){
        return [];
    }
    const suggestions = await Suggestion.find({
        term: {
            $regex: "^" + query.toLowerCase()
        }
    })
    .sort({frequency: -1})
    .limit(10)
    .lean();

    return suggestions.map(s => s.term)
}