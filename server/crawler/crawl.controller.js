import { enqueueUrl } from "./queue.service.js";

export const crawlPage = async(req, res) => {
    try{
        if(!req.body){
            return res.status(400).json({
                message: "Request body missing"
            })
        }
        const {url} = req.body;

        if(!url){
            return res.status(400).json({
                message: "URL is required"
            });
        }

        await enqueueUrl(url, 0);

        res.status(200).json({message: "url added to crawl queue"});
    }
    catch(error){
        console.log("Error in crawl controller: ", error.message);

        res.status(500).json({
            message: "failed to queue website"
        })
    }
}