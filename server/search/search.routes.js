import express from "express";

import { searchPages } from "./search.controller.js";
import { getSuggestionController } from "./suggestion.controller.js";

const router = express.Router();

router.get("/", searchPages);
router.get("/suggestions", getSuggestionController);

export default router;