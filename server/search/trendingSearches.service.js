import SearchHistory from "../models/SearchHistory.model.js"

export const getTrendingSearches = async() => {
    return await SearchHistory.find().sort({count: -1}).limit(10);
}