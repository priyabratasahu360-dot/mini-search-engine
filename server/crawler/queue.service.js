import CrawlQueue from "../models/crawlQueue.model.js";

export const enqueueUrl = async(url, depth = 0) => {
    try{
        const existing = await CrawlQueue.findOne({url});

        if(existing) return;

        await CrawlQueue.create({
            url,
            depth,
            status: "pending"
        });

        console.log(`queued: ${url}`);
    }
    catch(error){
        console.log("Queue insert failed", error);
    }
}