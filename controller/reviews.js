const Listing = require("../modules/listing.js");
const Review = require("../modules/review-schema.js");

module.exports.showReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id); //params is used to extracts info from url like id in this 
    let newReview = await new Review(req.body.reviews); // body id used to extract data from body(database)
    newReview.author = req.user;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review is created!");
    //console.log(newReview);
    res.redirect(`/listings/${listing._id}`);

};


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review is deleted!");
    res.redirect(`/listings/${id}`);
};