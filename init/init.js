require('dotenv').config();
const mongoose = require("mongoose");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_API_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Listing = require("../modules/listing");
const { data } = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderland";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        // First, delete all existing listings
        await Listing.deleteMany({});
        console.log("Deleted all existing listings");

        // For each listing in the data, add geometry
        for (let listing of data) {
            // Get coordinates from Mapbox
            const query = `${listing.location}, ${listing.country}`;
            const response = await geocodingClient.forwardGeocode({
                query,
                limit: 1
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                listing.geometry = response.body.features[0].geometry;
            }

            // Create and save the listing
            const newListing = new Listing(listing);
            await newListing.save();
            console.log(`Created listing for ${listing.location}`);
        }

        console.log("Database initialization complete!");
    } catch (err) {
        console.error("Error during initialization:", err);
    }
}

initDB();