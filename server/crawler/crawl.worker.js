import CrawlQueue from "../models/crawlQueue.model.js";
import { crawlWebsite } from "./crawl.service.js";

export const startCrawlerWorker = async() => {
    console.log("crawler worker started");

    while(true){
        let nextJob;
        try{
            nextJob = await CrawlQueue.findOne({
                status: "pending"
            });

            if(!nextJob){
                await new Promise(
                    resolve => setTimeout(resolve, 5000)
                );

                continue;
            }

            nextJob.status = "processing";

            await nextJob.save();

            const allowedHost = new URL(nextJob.url).hostname;

            await crawlWebsite(
                nextJob.url,
                allowedHost,
                nextJob.depth
            );

            nextJob.status = "completed";

            nextJob.lastCrawled = new Date();

            await nextJob.save();

            console.log(`Completed: ${nextJob.url}`);
        }
        catch(error){
            if(nextJob){
                nextJob.status = "failed";
                nextJob.error = error.message;
                await nextJob.save();
            }
            console.log("Worker error:", error);
        }

    }
}