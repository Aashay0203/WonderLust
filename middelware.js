/* const Listing = require("./modules/listing.js");
const Reviews = require("./modules/review-schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLogged = (req, res, next) => {
    //console.log('req.user:', req.user);
    res.locals.curruser = req.user;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must we logged In First");
        return res.redirect("/login");
    }
    return next();

};
//humne new middileware issliye bnya kyuki agar hum isse uaper bale midddleware karte to passportt seession
//  pura reset kar deta hai and to redirectUrl session sw chala jata 
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        req.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "Only owner can  make changes .");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Reviews.findById(reviewId);
    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "Only author can make changes .");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
        //console.log(errmsg);
    }
    else {
        next();
    }
};

 */

const Listing = require("./modules/listing.js");
const Reviews = require("./modules/review-schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLogged = (req, res, next) => {
    //console.log('req.user:', req.user);
    res.locals.curruser = req.user;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged In First");
        return res.redirect("/login");
    }
    next(); // Removed return - not needed
};

// Fixed typo: req.locals -> res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Fixed: res.locals not req.locals
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(res.locals.curruser._id)) {
            req.flash("error", "Only owner can make changes.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Reviews.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        if (!review.author.equals(res.locals.curruser._id)) {
            req.flash("error", "Only author can make changes.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errmsg)); // Use return next() instead of throw
    }
    next();
};