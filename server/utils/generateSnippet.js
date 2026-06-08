export const generateSnippet = (paragraph, terms) => {
    const lowerPara = paragraph.toLowerCase();

    for(const term of terms){
        const index = lowerPara.indexOf(term);
        if(index !== -1){
            const start = Math.max(0, index - 60);
            const end = Math.min(paragraph.length, index + 120);

            return(
                (start > 0 ? "..." : "") + 
                paragraph.slice(start, end) +
                (end < paragraph.length ? "..." : "")
            );
        }
    }

    return paragraph.slice(0, 200);
}