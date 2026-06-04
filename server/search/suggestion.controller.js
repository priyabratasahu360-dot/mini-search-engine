import { getSuggestion } from "./suggestion.service.js";

export const getSuggestionController = async(req, res) => {
    const {q} = req.query;

    const suggestion = await getSuggestion(q);

    res.status(200).json({message: "suggestion result", suggestion});
}