import SearchHistory from "../models/SearchHistory.model.js";

export const saveSearchQuery = async(query) => {
    const existing = await SearchHistory.findOne({query: query.toLowerCase()});

    if(existing){
        existing.count += 1;
        await existing.save();
        return;
    }

    await SearchHistory.create({
        query
    });
}