//This file stores the functions related to campgrounds that get passed into the routes, for code cleanliness

//import models
const { cloudinary,cloudStorage } = require("../cloudinary");
const {cloudinaryStorage}=require("../cloudinary")
const campGround=require("../models/campGround");

//Import this package to check for valid ID strings
const ObjectID=require("mongoose").Types.ObjectId;

//function that creates index page for campgrounds
module.exports.index=async (req,res)=>{
    //run find on the database to store camps in variable
    const camps=await campGround.find({});

    //passport provides us with an inbuilt method req.user that returns an object if someone is logged in
    const loggedIn=req.user?true:false;

    // res.render("campgrounds/index",{camps});
    res.render("campgrounds/index",{camps,loggedIn});
}

//function that cmakes new campground
module.exports.renderNewCampground=async(req,res)=>{
    res.render("campgrounds/new");
}

module.exports.postNewCampground=async(req,res,next)=>{
    //extract variables from form submission
    //if in form inputs name="campground[property]", then req.body automatically creates a campground object with all these sub properties. much neater
    const camp=new campGround(req.body.campground);

    console.dir(req.body, { depth: null });
    console.dir(req.files, { depth: null });

    //map over req.files and create a variable called campImages
    const campImages=req.files.map(f => ({url:f.path,filename:f.originalname}))
    for(let file of req.files){
        console.log(file);
    }

    //assign camp.images with new variable
    camp.images=campImages;

    for(let image of camp.images){
        console.log(image);
    }

    //Before saving, assign author property with req.user._id, which we have access to from passport
    camp.author=req.user._id;

    await camp.save();

    //add in flash message to successfully announce new campoground was made
    req.flash("success","Successfully added new campground");

    //redirect back to index and it should appear at end of list
    res.redirect("http://localhost:3000/camp");
}

//function to show a campground
module.exports.showCampground=async(req,res)=>{
    //extract id from url
    const {id}=req.params;

    //check for valid id string
    if(!ObjectID.isValid(id)){
        // throw new ExpressError("Invalid id provided",202);
        req.flash("error","Sorry that's not a valid ID format");
        return res.redirect("/camp");
    }
    
    //This structure allows us to see the author of each review, its a nested "populate" statement
    const foundCamp=await campGround.findById({_id:id}).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("author");
    console.log(foundCamp);

    //If passed valid ID check, now check that ID actually points to an object
    if(!foundCamp){
        // throw new ExpressError("Sorry that ID doesn't refer to any object",101);
        req.flash("error","Sorry there's no camp with that ID");
        return res.redirect("/camp");
    }

    //Note you DO not have to pass in the variable successMessages because its defined in res.locals in index.js
    res.render("campgrounds/show",{foundCamp});
}

//function to bring up form to edit a campground
module.exports.editCampgroundForm=async(req,res,next)=>{
    //extract id from url
    const {id}=req.params;
    const originalID=id;

    //check for valid id string
    if(!ObjectID.isValid(id)){
        // throw new ExpressError("Invalid id provided",202);
        req.flash("error","Sorry that's not a valid ID format");
        return res.redirect(`/camp`);
    }

    const foundCamp=await campGround.findById({_id:id});

    //If passed valid ID check, now check that ID actually points to an object
    if(!foundCamp){
        // throw new ExpressError("Sorry that ID doesn't refer to any object",101);
        req.flash("error","Sorry there's no camp with that ID");
        return res.redirect(`/camp`);
    }   

    res.render("campgrounds/edit",{foundCamp});
}

//Function to edit camp
module.exports.editCampground=async(req,res,next)=>{
    //extract id from url
    const {id}=req.params;
    console.log(id);

    //Updated logic
    //First find the camp
    const foundCamp=await campGround.findById(id);

    //call find by id and update
    await foundCamp.updateOne(req.body.campground);

    //add in flash message to successfully announce campground was edited
    req.flash("success","Successfully edited campground");

    // //redirect to show page for that item
    res.redirect(`/camp/${id}`);
}

//function to delete a campground
module.exports.deleteCampground=async(req,res)=>{
    //extract id from url
    const {id}=req.params;
    console.log(id);

    //call find by id and update
    await campGround.findByIdAndDelete(id);

    //add in flash message to successfully announce campground deleted
    req.flash("success","Successfully deleted campground");

    // //redirect to index page
    res.redirect("/camp");
}