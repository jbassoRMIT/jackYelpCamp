const campGround = require("./models/campGround");
const Reviews = require("./models/review");

//import schema validations
//import validation schemas, destructure, as will add other schemas down the line
const {campgroundSchema,reviewSchema}=require("./schemas");

//import express error
const ExpressError=require("./utilities/ExpressError")

//Putting middleware here that can be used in all routes
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","Sorry you're not logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//define a function that handles campground schema validation
module.exports.handleCampValidation=(req,res,next)=>{
    //save the validation to a variable, passing in form results as argument
   //destructure so we only extract error variable
   //Basically saying if the result.error returns with something, we pass those details onto a new Express error. 
   // logic handleed for each case
   const {error}=campgroundSchema.validate(req.body);

   if(error){
       const msg=error.details.map(el => el.message).join(",");
       throw new ExpressError(msg,300);
   }else{
       //This is crucial, if an error is not thrown, this is how the app trickles down to next call
       next();
   }
}

//Similarly create a validation function to validate new reviews
module.exports.handleReviewValidation=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
 
    if(error){
        const msg=error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,700);
    }else{
        //This is crucial, if an error is not thrown, this is how the app trickles down to next call
        next();
    }
 }

 //2 separate functions, one to check camp author, one to check review author
module.exports.isAuthor=async function(req,res,next){
    //Extract id from params
    const {id}=req.params;

    const foundCamp=await campGround.findById(id);
    //lastly we want to flash an error if currentUser not equal to foundCamp.author, and rewdirect to show page
    if(!foundCamp.author.equals(req.user._id)){
        req.flash("error","Sorry you dont' have permission to edit");
        return res.redirect(`/camp/${id}`)
    }
    next();
}

module.exports.isReviewAuthor=async function(req,res,next){
    //Extract id from params, omg be sure to name the variables same as :id and :reviewID from reviews.js, otherwise it wont be recognised
    const {id,reviewID}=req.params;
    console.log(`campId ${id}`);
    console.log(`reviewID ${reviewID}`);

    const foundReview=await Reviews.findById(reviewID);
    console.log(`found review: ${foundReview}`);

    //lastly we want to flash an error if currentUser not equal to foundCamp.author, and rewdirect to show page
    if(!foundReview.author.equals(req.user._id)){
        req.flash("error","Sorry you dont' have permission to delete this review");
        return res.redirect(`/camp/${id}`)
    }
    next();
}
