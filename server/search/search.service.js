import Page from "../models/page.model.js";
import { generateSnippet } from "../utils/generateSnippet.js";

export const searchWebsitePages = async(query, page = 1, limit = 10) => {

    const skip = (page - 1) * limit;

    const terms = query
                      .toLowerCase()
                      .split(/\s+/)
                      .filter(Boolean);

    const pages = await Page.find({
        terms: {$in: terms}
    }, {
        url: 1,
        title: 1,
        description: 1,
        favicon: 1,
        siteName: 1,
        index: 1
    }).lean();

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
            const tfA = a.index?.[term] || 0;
            const tfB = b.index?.[term] || 0;

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
    );

    const pageIds = paginatedResults.map(p => p._id);

    const pagesWithParagraphs = await Page.find({
        _id: {$in: pageIds}
    }, {
        paragraphs: 1
    }).lean();

    // adding paragraphs to pages
    const paragraphsMap = new Map(
        pagesWithParagraphs.map(p => [
            p._id.toString(),
            p.paragraphs
        ])
    )

    return {
        total: rankedResults.length,
        page,
        limit,
        totalPages: Math.ceil(
            rankedResults.length / limit
        ),

        results: paginatedResults.map((page) => {

            const paragraphs = paragraphsMap.get(page._id.toString()) || [];

            const matchingParagraph = paragraphs.find((paragraph) => 
                typeof paragraph === "string" && 
            terms.some(term => 
                paragraph.toLowerCase().includes(term)
            )) || paragraphs[0];
            
            return {
                url: page.url,
                title: page.title,
                description: page.description,
                favicon: page.favicon,
                siteName: page.siteName,
                score: terms.reduce((total, term) => {
                    const tf = page.index?.[term] || 0;

                    let score = tf * idfMap[term];
                    
                    if(page.title.toLowerCase().includes(term)){
                        score += 10
                    }
                    
                    return total + score;
                }, 0),
                snippet: matchingParagraph ? 
                generateSnippet(matchingParagraph, terms)
                 : "No preview available"
            }
        })
    }
}