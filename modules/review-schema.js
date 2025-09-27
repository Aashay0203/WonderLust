const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comments: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Reviews", reviewSchema);
