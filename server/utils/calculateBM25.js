export const calculateBM25 = (page, term, avgDocumentLength, idfMap) => {

    const k1 = 1.2;
    const bValue = 0.75;

    const tf = page.index?.[term] || 0;

    if(tf === 0){
        return 0;
    }

    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - bValue + bValue * (page.documentLength / avgDocumentLength));

    return idfMap[term] * (numerator / denominator);
}