const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const Review = require("../Model/review.js");
const Listing = require("../Model/listing.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//Review
//Post Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;