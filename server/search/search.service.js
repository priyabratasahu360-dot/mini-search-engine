import Page from "../models/page.model.js";

export const searchWebsitePages = async(query, page = 1, limit = 10) => {

    const skip = (page - 1) * limit;

    const terms = query
                      .toLowerCase()
                      .split(/\s+/)
                      .filter(Boolean);

    const pages = await Page.find({
        $or: terms.map(term => ({
            [`index.${term}`]: {
                $exists: true
            }
        }))
    });

    const totalDocuments = await Page.countDocuments();

    const idfMap = {};

    for(const term of terms){
        const documentFrequency = await Page.countDocuments({
            [`index.${term}`]: {
                $exists: true
            }
        });

        idfMap[term] = Math.log(totalDocuments / (documentFrequency || 1));
    }

    // ranking

    const rankedResults = pages.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        for(const term of terms){
            const tfA = a.index.get(term) || 0;
            const tfB = b.index.get(term) || 0;

            let termScoreA = tfA * idfMap[term];

            let termScoreB = tfB * idfMap[term];

            if(a.title.toLowerCase().includes(term)){
                termScoreA += 10;
            }

            if(b.title.toLowerCase().includes(term)){
                termScoreB += 10;
            }

            scoreA += termScoreA;
            scoreB += termScoreB;
        }

        return scoreB - scoreA;
    });

    const paginatedResults = rankedResults.slice(
        skip,
        skip + limit
    )

    return {
        total: rankedResults.length,
        page,
        limit,
        totalPages: Math.ceil(
            rankedResults.length / limit
        ),

        results: paginatedResults.map((page) => {

            
            const matchingParagraph = page.paragraphs.find((paragraph) => 
                typeof paragraph === "string" && 
            terms.some(term => 
                paragraph.toLowerCase().includes(term)
            )) || page.paragraphs[0];
            
            return {
                url: page.url,
                title: page.title,
                score: terms.reduce((total, term) => {
                    const tf = page.index.get(term) || 0;

                    let score = tf * idfMap[term];
                    
                    if(page.title.toLowerCase().includes(term)){
                        score += 10
                    }
                    
                    return total + score;
                }, 0),
                snippet: matchingParagraph ? matchingParagraph.slice(0, 300) : "No preview available"
            }
        })
    }
}