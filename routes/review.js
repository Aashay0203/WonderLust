const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/error.js");
const { showReview, destroyReview } = require("../controller/reviews.js");

const Listing = require("../modules/listing.js");
const Review = require("../modules/review-schema.js");
const { isLogged, validateReviews, isReviewAuthor } = require("../middelware.js")



//************Review Schema**************
//Show Route
router.post("/", validateReviews, isLogged, wrapAsync(showReview));

//Delete Route
router.delete("/:reviewId", isReviewAuthor, isLogged, wrapAsync(destroyReview));

module.exports = router;