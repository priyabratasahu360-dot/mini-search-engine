export const hasPhrase = (positions, terms) => {
    const firstPositions = positions[terms[0]];

    if(!firstPositions){
        return false;
    }

    for(const start of firstPositions){
        let matched = true;

        for(let i = 1; i < terms.length; i++){
            const currentPositions = positions[terms[i]];

            if(!currentPositions){
                matched = false;
                break;
            }

            if(currentPositions.includes(start + i)){
                matched = false;
                break;
            }
        }

        if(matched){
            return true;
        }

    }
    return false;
}