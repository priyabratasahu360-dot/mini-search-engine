import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import crawlRoutes from "./crawler/crawl.routes.js";
import searchRoutes from "./search/search.routes.js";
import { connectDB } from "./lib/db.js";
import { startCrawlerWorker } from "./crawler/crawl.worker.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use("/api/crawl", crawlRoutes);
app.use("/api/search", searchRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
    if(process.env.ENABLE_CRAWLER === "true"){
        console.log("Crawler enabled");
        startCrawlerWorker();
    }
    console.log("Crawler disabled");
});