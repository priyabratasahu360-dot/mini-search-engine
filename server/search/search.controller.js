import { searchWebsitePages } from "./search.service.js";

export const searchPages = async(req, res) => {
    try{
        const {q} = req.query;

        if(!q){
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const results = await searchWebsitePages(q, page, limit);

        res.status(200).json({
            message: "searched result",
            results
        });
    }
    catch(error){
        console.log("Error in search controller", error);
        re.status(500).json({
            message: "Failed to search pages"
        })
    }
}