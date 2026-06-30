import axios from "axios";

import { parseHTML } from "../parser/parser.service.js";
import { createIndex } from "../indexer/index.service.js";
import Page from "../models/page.model.js";
import { normalizeUrl } from "./crawl.utils.js";
import { enqueueUrl } from "./queue.service.js";
import Suggestion from "../models/suggestion.model.js";


export const crawlWebsite = async(url, allowedHost, depth = 0, maxDepth = 5) => {

    //stop deep recursion
    if(depth > maxDepth){
        return;
    }
    console.log(`crawling ${url}`)
    
    try{
        const res = await axios.get(url, {
            timeout: 5000,

            headers: {
                "User-Agent": "MiniSearchBot/1.0"
            }
        });
        
        const html = res.data;
        
        const parsedData = parseHTML(html, url);
        
        const {index,positions, documentLength} = createIndex(parsedData);

        const terms = Object.keys(index);

        const operations = terms.map(term => ({
            updateOne: {
                filter: {term},
                update: {$inc: {frequency: 1}},
                upsert: true
            }
        }));

        await Suggestion.bulkWrite(operations);
        
        await Page.findOneAndUpdate({url}, {
            url,
            title: parsedData.title,
            description: parsedData.description,
            paragraphs: parsedData.paragraphs,
            links: parsedData.links,
            index,
            positions,
            terms,
            documentLength,
            favicon: parsedData.favicon,
            siteName: parsedData.siteName
        }, {upsert: true});

        const limitedLinks = parsedData.links.slice(0, 100);

        
        //recursively crawl link
        const crawlPromises = limitedLinks.map(
            async(link) => {
                const normalizedLink = normalizeUrl(url, link);
                
                if(!normalizedLink) return;

                let linkHost;

                try{
                    linkHost = new URL(normalizedLink).hostname
                }
                catch{
                    return;
                }

                if(linkHost !== allowedHost){
                    return;
                }

                await enqueueUrl(
                    normalizedLink,
                    depth + 1,
                )
            }
        )

        await Promise.all(crawlPromises);
    }
    catch(error){
        console.log("Failed crawling", url);
    }
}