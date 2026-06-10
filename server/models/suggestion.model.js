import mongoose from "mongoose";

export const suggestionSchema = new mongoose.Schema({
    term: {
        type: String,
        unique: true,
        index: true
    },
    frequency: {
        type: Number,
        default: 1
    }
});

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

export default Suggestion;