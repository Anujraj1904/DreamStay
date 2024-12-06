const Listing = require("../models/listing");

//Index routes
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//New routes
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//Show routes
//it show individual listings.
module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  const currUser = req.user;
  console.log("Current User:", currUser);
  console.log("Listing Owner:", listing.owner);
  res.render("listings/show.ejs", { listing, currUser });
};

//Create routes
module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "Your listing has been created!");
  res.redirect("/listings");
};

//Edit routes
module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Your listing has been edited!");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImageUrl  = originalImage.replace("/uplode", "/uplode/ w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl});
};

//Update routes
module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
  req.flash("success", "Your listing has been updated!");
  res.redirect(`/listings/${id}`);
};

//Delete routes
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Your listing has been deleted!");
  res.redirect("/listings");
};
