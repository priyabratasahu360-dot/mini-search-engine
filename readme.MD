# MINI SEARCH ENGINE

- A Fullstack search engine built from scratch using React, Node.js, Express and MongoDB. This project currently crawl only MDN website, index content, stores term frequency for ranking and provides search suggestion and pagination.

## Features

### Web Crawler

- Crawl web pages from given url
- Extract page title, paragraphs, links
- Follow internal links to specific depth given by developer
- Stores crawled content in MongoDB

### Indexing

- Creates index of page content
- Removes unnecessary stop words
- Normalizes and stores term frequency for ranking

### Search Engine

- TF-IDF based ranking
- pagination support
- Search suggestion

## Tech Stack

### Frontend
- React
- TailwindCSS
- Axios

### Backend
- Express
- MongoDB
- Mongoose
- Cheerio
- Axios

## Installation

```bash
git clone https://github.com/priyabratasahu360-dot/mini-search-engine.git
```

## backend setup
```bash
cd server
```
```bash
npm install
```

- Create a .env file: 
MONGO_CONN_URL=your url here

### Start server

```bash
npm run dev
```

## Frontend setup

```bash
cd client
```

```bash
npm install
```

```bash
npm run dev
```

### API ENDPOINTS

Crawl:

POST /api/crawl

req: 
{
    "url": "https://developer.mozilla.org/en-US/docs/Web/javascript"
}

Search: 

GET /api/search?q=javascript&page=1


## Future Improvements

- implement AI model to retrive data based on what user want instead of giving result based on exact word
- User search history and more frequent search terms
- Recrawling technique for updated pages
- Advanced ranking algorithm 


#### This Project built as a learning project to learn more advanced backend concept and to understand how search engines works

By Priyabrat Sahu.......
