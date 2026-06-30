import { connectDB } from "../lib/db.js";
import Page from "../models/page.model.js";
import { STOP_WORDS } from "../utils/stopwords.js";

await connectDB();

const RESERVED = new Set([
    "__proto__",
    "prototype",
    "constructor"
]);

const pages = await Page.find({});

for (const page of pages) {
  const text = [page.title, ...page.paragraphs].join(" ");

  const words = text.toLowerCase().split(/\s+/);

  const positions = new Map();
  let position = 0;

  for (const rawWord of words) {
    const cleanedWord = rawWord.replace(/[^a-z0-9]/g, "");

    if (
      cleanedWord === "prototype" ||
      cleanedWord === "__proto__" ||
      cleanedWord === "constructor"
    ) {
      console.log("Reserved:", cleanedWord);
    }

    if (!cleanedWord) continue;

    if (STOP_WORDS.includes(cleanedWord)) continue;

    if(RESERVED.has(cleanedWord)) continue;

    if (cleanedWord.length < 2) continue;

    if (!positions.has(cleanedWord)) {
      positions.set(cleanedWord, []);
    }

    positions.get(cleanedWord).push(position);

    position++;
  }

  page.positions = positions;
  await page.save();
}

console.log("migration completed");
