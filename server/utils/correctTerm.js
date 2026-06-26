import {levenshtein} from "./levenshtein.js";

export const correctTerm = (term, suggestions) => {

    let bestMatch = term;
    let bestDistance = Infinity;

    for(const suggestion of suggestions){
        const distance = levenshtein(
            term,
            suggestion.term
        );

        if(distance < bestDistance){
            bestDistance = distance;
            bestMatch = suggestion.term;
        }
    }

    
    if(bestDistance <= 2){
        // console.log(bestMatch);
        return bestMatch;
    }

    return term;

}
