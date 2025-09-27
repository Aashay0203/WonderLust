const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review-schema.js");

const imageSchema = new Schema({
    filename: {
        type: String,
        default: "listingimage",
        set: (v) => v.trim() === "" ? undefined : v,
    },
    url: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.3fE8SeTUeDAm0I7wCA1Z6AAAAA?rs=1&pid=ImgDetMain",
        set: (v) => v.trim() === "" ? undefined : v,  // Convert "" to undefined
    },
});


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: imageSchema,
        default: () => ({ filename: "default.jpg", url: "https://th.bing.com/th/id/OIP.3fE8SeTUeDAm0I7wCA1Z6AAAAA?rs=1&pid=ImgDetMain" }),
        required: false, // Default for the image object
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Reviews"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

