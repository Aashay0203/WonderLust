const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/error.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLogged, isOwner } = require("../middelware.js");
const Listing = require("../modules/listing.js");
const { index, destroyRoute, renderNewForm, createForm, showRoute, editRoute, updateRoute } = require("../controller/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// Validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, errMsg));
    }
    next();
};

// Handle upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer error:", err.message);
        req.flash("error", "File upload error: " + err.message);
        return res.redirect("/listings/new");
    }
    next(err);
};

// Routes
router.route("/")
    .get(wrapAsync(index))
    .post(
        isLogged,
        (req, res, next) => {
            upload.single("listing[image]")(req, res, (err) => {
                if (err) return handleUploadError(err, req, res, next);
                next();
            });
        },
        validateListing,
        wrapAsync(createForm)
    );

router.get("/new", isLogged, renderNewForm);

router.route("/:id")
    .get(wrapAsync(showRoute))
    .put(
        isLogged,
        isOwner,
        (req, res, next) => {
            upload.single("listing[image]")(req, res, (err) => {
                if (err) return handleUploadError(err, req, res, next);
                next();
            });
        },
        validateListing,
        wrapAsync(updateRoute)
    )
    .delete(isLogged, isOwner, wrapAsync(destroyRoute));

router.get("/:id/edit", isLogged, isOwner, wrapAsync(editRoute));

module.exports = router;