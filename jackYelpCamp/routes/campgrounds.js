//import express and router
const express=require("express");
const router=express.Router();
//import passport
const passport=require("passport");

//import functions from controllers
const campgroundController=require("../Controllers/campgrounds.js")

//import middleware function that checks for logged in status
//must import as destructured so the app knows its a function and not something else
const {isLoggedIn, isAuthor,handleCampValidation}=require("../middleware.js");

//import custom error class
const ExpressError=require("../utilities/ExpressError.js");

//Import this package to check for valid ID strings
const ObjectID=require("mongoose").Types.ObjectId;

//import wrapAsync function
const wrapAsync=require("../utilities/catchAsync");

//import model
const campGround=require("../models/campGround.js");
const Reviews=require("../models/review.js");

//inport the multer package to handle image upload for forms
const multer=require("multer");
//import storage
const {cloudStorage}=require("../cloudinary/index.js");

//Activate multer middleware, and set a destination for files to be uploaded to.
const upload =multer({cloudStorage,preservePath:true});

router.route("/")
    .get(wrapAsync(campgroundController.index))
    // .post(isLoggedIn,handleCampValidation,wrapAsync(campgroundController.postNewCampground))
    //Note what we pass to uploads.single must match name="" in form -> with with req.file
    //uploads.array allows us to upload multiple images with label campground[image] -> view with req.files
    .post(isLoggedIn,upload.array("image"),handleCampValidation,wrapAsync(campgroundController.postNewCampground))

//add route for new campground
//Pass in isLoggedIn function to protect route
router.get("/new",isLoggedIn,wrapAsync(campgroundController.renderNewCampground));


router.route("/:id")
    .get(wrapAsync(campgroundController.showCampground))
    .put(isLoggedIn,isAuthor, handleCampValidation,wrapAsync(campgroundController.editCampground))
    .delete(isLoggedIn,isAuthor,campgroundController.deleteCampground);


//add post route for where new campground form submits to
//Also protect from not logged in users


//setup show route for a single campground
//Also protect from not logged in users


//setup get route to edit a campground
//also protsct with isLoggedIn middleware
router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(campgroundController.editCampgroundForm));

//setup edit route for a campground
//Now create put route for where form data is sent to after an item has been edited
//Note this only works if we use method-override package
router;

//add in delete route for campgrounds
router

//export the router variable
module.exports=router;