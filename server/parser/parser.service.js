import * as cheerio from "cheerio";

export const parseHTML = (html) => {
    const $ = cheerio.load(html);

    const title = $("title").text();

    const paragraphs = [];
    $("p").each((index, element) => {
        const text = $(element).text().trim();

        if(text.length > 120){
            paragraphs.push(text);
        }
    });

    const links = [];
    $("a").each((index, element) => {
        const href = $(element).attr("href");

        if(href){
            links.push(href);
        }
    });

    return{
        title,
        paragraphs,
        links
    }
}