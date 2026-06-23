import {createClient} from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.log("Error connecting to redis server", error);
})

await redisClient.connect();

console.log("Redis conneted");