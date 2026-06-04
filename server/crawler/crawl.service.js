import axios from "axios";

import { parseHTML } from "../parser/parser.service.js";
import { createIndex } from "../indexer/index.service.js";
import Page from "../models/page.model.js";
import { normalizeUrl } from "./crawl.utils.js";
import { enqueueUrl } from "./queue.service.js";


export const crawlWebsite = async(url, allowedHost, depth = 0, maxDepth = 3) => {

    //stop deep recursion
    if(depth > maxDepth){
        return;
    }
    console.log(`crawling ${url}`)
    
    try{

        const existingPage = await Page.findOne({url});
        
        if(existingPage){
            return {
                message: "Page already crawled",
                page: existingPage
            }
        }
        
        const res = await axios.get(url, {
            timeout: 5000,

            headers: {
                "User-Agent": "MiniSearchBot/1.0"
            }
        });
        
        const html = res.data;
        
        const parsedData = parseHTML(html);
        
        const index = createIndex(parsedData);
        
        await Page.create({
            url,
            title: parsedData.title,
            paragraphs: parsedData.paragraphs,
            links: parsedData.links,
            index
        });

        const limitedLinks = parsedData.links.slice(0, 20);

        
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