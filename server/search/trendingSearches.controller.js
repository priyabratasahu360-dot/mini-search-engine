import { getTrendingSearches } from "./trendingSearches.service.js";

export const getTrendingController = async(req, res) => {
    const trendingResults = await getTrendingSearches();

    return res.status(200).json({message: "trending searches", trendingResults});
}