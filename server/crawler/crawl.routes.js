import express from "express";

import { crawlPage } from "./crawl.controller.js";

const router = express.Router();

router.post("/", crawlPage);

export default router;