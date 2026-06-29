import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import Page from "../models/page.model.js";

await connectDB();

const pages = await Page.find({},
    {
        title: 1,
        paragraphs: 1
    }
);

for(const page of pages){
    const text = [
        page.title,
        ...(page.paragraphs || [] )
    ].join(" ");

    const documentLength = text.toLowerCase()
                               .split(/\s+/)
                               .filter(Boolean).length;
    
    page.documentLength = documentLength;

    await page.save();
}

console.log("migration completed");

process.exit(0)