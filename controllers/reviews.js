const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Posting Review routes
module.exports.postingReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Your review has been added!");
  res.redirect(`/listings/${listing._id}`);
  // console.log("new review saved");
  // res.send("new review saved");
};

//DELETE REVIEW routes

module.exports.deleteReviews = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Your review has been deleted!");
  res.redirect(`/listings/${id}`);
};