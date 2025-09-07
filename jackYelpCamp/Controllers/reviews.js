//This file stores the functions related to reviews that get passed into the routes, for code cleanliness

//Import reviews and camps model
const campGround=require("../models/campGround");
const Reviews=require("../models/review");

//function to create a new review
module.exports.postNewReview=async(req,res,next)=>{
    // console log form data to  check routing correct
    // res.send(req.body);
    // //extract id from from params
    // const {id}=req.params;

    // //find relevant campground based on id
    const foundCamp= await campGround.findById(req.params.id);

    // //create a review based on form data
    const review=new Reviews(req.body.review);

    //Also set review author to req.user
    review.author=req.user._id;

    //push review to foundCamp and save review and foundCamp
    foundCamp.reviews.push(review);
    await foundCamp.save();
    await review.save();

    //add in flash message to successfully announce new campoground was made
    req.flash("success",`Successfully added new review for camp ${foundCamp.title}`);


    // //redirect back to index and it should appear at end of list
    res.redirect(`http://localhost:3000/camp/${req.params.id}`)
}

//Function to delete a review
module.exports.deleteReview=async(req,res,next)=>{
    //extract id from url
    const {id,reviewID}=req.params;
    // console.log(`campId ${id}`);
    // console.log(`reviewId ${reviewID}`);

    //find the camp so we can use its name in the flash messaage
    const foundCamp=await campGround.findById(id);

    //Run find by id and update on campID, and pull where reviews=reviewID
    await campGround.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});

    //call find by id and delete on the review as well to remove it from reviews too. 
    await Reviews.findByIdAndDelete(reviewID);

    //add in flash message to successfully announce new campoground was made
    req.flash("success",`Successfully deleted review for ${foundCamp.title}`);

    // //redirect to index page
    res.redirect(`/camp/${id}`);
}