const Listing = require("../modules/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_API_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        return res.render("./listings/index.ejs", { allListings });
    } catch (err) {
        return next(err);
    }
};

module.exports.renderNewForm = (req, res) => {
    return res.render("./listings/new.ejs");
};

module.exports.createForm = async (req, res, next) => {
    try {
        if (!req.body.listing) {
            throw new Error("Invalid listing data");
        }

        // Get coordinates for the location
        let response = await geocodingClient.forwardGeocode({
            query: `${req.body.listing.location},${req.body.listing.country}`,
            limit: 1
        }).send();

        if (!response.body.features.length) {
            throw new Error("Location not found. Please try a different location.");
        }

        const newListing = new Listing(req.body.listing);

        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        if (req.user) {
            newListing.owner = req.user._id;
        }

        newListing.geometry = response.body.features[0].geometry;

        try {
            await newListing.save();
            req.flash("success", "New Listing Created!");
            return res.redirect("/listings");
        } catch (err) {
            console.error("Error saving listing:", err);
            return next(err);
        }
    } catch (err) {
        console.error("Error in createForm:", err);
        return next(err);
    }
};

module.exports.destroyRoute = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully");
        return res.redirect("/listings");
    } catch (err) {
        return next(err);
    }
};

module.exports.showRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    //console.log("Listing owner:", listing.owner);
    res.render("./listings/show.ejs", { listing });
};

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "This Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateRoute = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Update listing with geocoding if location changed
        if (req.body.listing.location !== listing.location || req.body.listing.country !== listing.country) {
            const response = await geocodingClient.forwardGeocode({
                query: `${req.body.listing.location},${req.body.listing.country}`,
                limit: 1
            }).send();

            if (response.body.features.length) {
                req.body.listing.geometry = response.body.features[0].geometry;
            }
        }

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated Successfully!");
        return res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error in updateRoute:", err);
        return next(err);
    }
};



