//import express and router
const express=require("express");
//mergeParams is how you indicate pass on params from index file. 
const router=express.Router({mergeParams:true});

//import custom error class
const ExpressError=require("../utilities/ExpressError.js");

//import controller
const reviewController=require("../Controllers/reviews.js");

//Import this package to check for valid ID strings
const ObjectID=require("mongoose").Types.ObjectId;

//import wrapAsync function
const wrapAsync=require("../utilities/catchAsync");

//import model
const campGround=require("../models/campGround.js");
const Reviews=require("../models/review.js");

//import middleware
const {handleReviewValidation,isLoggedIn,isReviewAuthor}=require("../middleware.js");

//import validation schemas, destructure, as will add other schemas down the line
const {reviewSchema}=require("../schemas.js");



 //add post route for where new review form submits to
router.post("/",isLoggedIn,handleReviewValidation,wrapAsync(reviewController.postNewReview));

//add in delete route for reviews
router.delete("/:reviewID",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;