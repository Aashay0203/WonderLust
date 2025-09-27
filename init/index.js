
const mongoose = require("mongoose");
const Listing = require("../modules/listing.js");
const initData = require("./data.js");

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
        console.log("Connected to MongoDB");
        await initDb();
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

const initDb = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "68c16c985693a154c6006dd6" }));

        const insertResult = await Listing.insertMany(initData.data);
        console.log(`Database initialized with ${insertResult.length} listings`);
    } catch (err) {
        if (err.name === 'ValidationError') {
            for (let field in err.errors) {
                console.error(`Validation error for ${field}: ${err.errors[field].message}`);
            }
        } else {
            console.error("Error initializing database:", err);
        }
    }
};

main().then(() => {
    console.log("Initialization complete");
}).catch(err => {
    console.error("Fatal error:", err);
});
