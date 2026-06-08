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

    const favicon = $('link[rel="icon"]').attr("href") ||
                    $('link[rel="shortcut icon"]').attr("href");

    
    const siteName = $('meta[property="og:site_name"]').attr("content");
    return{
        title,
        paragraphs,
        links,
        favicon,
        siteName
    }
}