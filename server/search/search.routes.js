import express from "express";

import { searchPages } from "./search.controller.js";
import { getSuggestionController } from "./suggestion.controller.js";
import { getTrendingController } from "./trendingSearches.controller.js";

const router = express.Router();

router.get("/", searchPages);
router.get("/suggestions", getSuggestionController);
router.get("/trending", getTrendingController);

export default router;