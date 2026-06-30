import Page from "../models/page.model.js";
import { generateSnippet } from "../utils/generateSnippet.js";
import { redisClient } from "../lib/redis.js";
import { correctTerm } from "../utils/correctTerm.js";
import Suggestion from "../models/suggestion.model.js";
import { calculateBM25 } from "../utils/calculateBM25.js";
import { hasPhrase } from "../utils/hasPhrase.js";

export const searchWebsitePages = async(query, page = 1, limit = 10) => {

    const skip = (page - 1) * limit;

    const terms = query
                      .toLowerCase()
                      .split(/\s+/)
                      .filter(Boolean);
    const suggestions = await Suggestion.find(
        {},
        {
            term: 1,
            frequency: 1
        }
    ).lean();

    const validatedTerms = terms.map((term) => (
        correctTerm(term, suggestions)
    ));

    const cacheKey = `search: ${query.toLowerCase()}: ${page}: ${limit}`;

    const cachedResult = await redisClient.get(cacheKey);

    if(cachedResult){
        console.log("cached");

        return JSON.parse(cachedResult);
    }

    console.log("cache missed");

    const pages = await Page.find({
        terms: {$in: validatedTerms}
    }, {
        url: 1,
        title: 1,
        description: 1,
        favicon: 1,
        siteName: 1,
        index: 1,
        positions: 1,
        documentLength: 1
    }).lean();

    const totalDocuments = await Page.countDocuments();

    const result = await Page.aggregate([
        {
            $group: {
                _id: null,
                avgDocumentLength: {
                    $avg: "$documentLength"
                }
            }
        }
    ]);

    const avgDocumentLength = result[0].avgDocumentLength;

    // console.log(avgDocumentLength);
    
    const idfMap = {};

    
    for(const term of validatedTerms){
        const documentFrequency = await Page.countDocuments({
            [`index.${term}`]: {
                $exists: true
            }
        });

        idfMap[term] = Math.log(totalDocuments / (documentFrequency || 1));
    }

    for(const page of pages){
        let score = 0

        for(const term of validatedTerms){
            let termScore = calculateBM25(page, term, avgDocumentLength, idfMap);
              
            if(page.title.toLowerCase().includes(term)){
                termScore += 10;
            }

            score += termScore
        }

        if(hasPhrase(page.positions, validatedTerms)){
            score += 20
        }

        page.score = score;
    }


    const rankedResults = pages.sort((a, b) => {

        return b.score - a.score;
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
    // console.log(validatedTerms)

    const response = {
        correctedQuery: validatedTerms,
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
            validatedTerms.some(term => 
                paragraph.toLowerCase().includes(term)
            )) || paragraphs[0];
            
            return {
                url: page.url,
                title: page.title,
                description: page.description,
                favicon: page.favicon,
                siteName: page.siteName,
                score: page.score,
                snippet: matchingParagraph ? 
                generateSnippet(matchingParagraph, validatedTerms)
                 : "No preview available"
            }
        })
    }

    await redisClient.set(
        cacheKey,
        JSON.stringify(response),
        {
            EX: 300 // expires in 300 seconds
        }
    )

    return response;
}