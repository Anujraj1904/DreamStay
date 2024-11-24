const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.redirectUrl= req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
     return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res,next) => {
  const currUser = req.user;
    let { id } = req.params;
    let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(currUser._id)){
    req.flash("error", "You are not the owner of the listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Server side validation which means now you can not send empty response with useing HOPPSCOTCH.

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req, res,next) => {
  const currUser = req.user;
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
  if(!review.author.equals(currUser._id)){
    req.flash("error", "You are not the author of the review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};