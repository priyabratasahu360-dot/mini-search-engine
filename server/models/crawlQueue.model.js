import mongoose from "mongoose";

const crawlQueueSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "failed"
        ],

        default: "pending"
    },

    depth: {
        type: Number,
        default: 0
    },

    error: {
        type: String,
        default: null
    },

    lastCrawled: {
        type: Date,
        default: null
    }
}, {timestamps: true});

const CrawlQueue = mongoose.model("CrawlQueue", crawlQueueSchema);

export default CrawlQueue;