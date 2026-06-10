import mongoose from "mongoose";
import dotenv from "dotenv";
import Page from "../models/page.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_CONN_URL);

console.log("connected to mongodb");

const pages = await Page.find();

for(const page of pages){
    const terms = Array.from(page.index.keys());

    page.terms = terms;

    await page.save();
}

console.log(`Updated ${pages.length} pages`);

await mongoose.disconnect();

console.log("migration completed")