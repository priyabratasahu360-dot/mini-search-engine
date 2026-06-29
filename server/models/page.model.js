import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    paragraphs: {
        type: [String],
        default: []
    },

    description: {
        type: String,
        default: ""
    },

    links: {
        type: [String],
        default: []
    },

    index: {
        type: Map,
        of: Number,
        default: {}
    },

    terms: {
        type: [String],
        default: [],
        index: true
    },
    documentLength: {
        type: Number,
        default: 0
    },
    
    favicon: {
        type: String,
        default: ""
    },

    siteName: {
        type: String,
        default: ""
    },

    crawledAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Page = mongoose.model("Page", pageSchema);

export default Page;