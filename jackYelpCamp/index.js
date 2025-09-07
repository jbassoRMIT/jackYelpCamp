if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}

//require ("dontenv") give us access to env."variable name";
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_SECRET);
console.log(process.env.CLOUDINARY_KEY);

//import express and start it up with app.listen
const express=require("express");
const mongoose=require("mongoose");
//Import this package to check for valid ID strings
const ObjectID=require("mongoose").Types.ObjectId;
const methodOverride=require("method-override");
//install this package for styling
const ejsMate=require("ejs-mate");
const app=express();
const path=require("path");
//install joi package for data validation
const Joi=require("joi");

//npm i express-session and import
const session=require("express-session");

//npm i connect-flash and import
const flash=require("connect-flash");




//import regular passport and local passport
const passport=require("passport");
const localStrategy=require("passport-local");

//write session settings then call app.session
const sessionConfig={
    secret: "This is my secret word",
    resave:false,
    saveUninitialized:true,
    //Setup specific cookie settings
    cookie:{
        //expires a week from now. Date.now() returns time object in ms, so 1000*60*60*24*7 adds a week in ms
        expiry: Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};
app.use(session(sessionConfig));

//import validation schemas, destructure, as will add other schemas down the line
const {campgroundSchema,reviewSchema}=require("./schemas.js");

//import custom error class
const ExpressError=require("./utilities/ExpressError");

//import wrapAsync function
const wrapAsync=require("./utilities/catchAsync")

//import models
const campGround=require("./models/campGround.js");
const Reviews=require("./models/review.js");
const Users=require("./models/user.js");

//import router object from campgrounds.js
const campRouter=require("./routes/campgrounds.js");

//import router object from campgrounds.js
const reviewRouter=require("./routes/reviews.js");

//import router object from users.js
const userRouter=require("./routes/users.js");

// Connect to mongoose
const { type } = require('os');
mongoose.connect('mongodb://127.0.0.1:27017/jackYelpApp')
.then(()=>{
    console.log("connection open!");
})
.catch((error)=>{
    console.log(`Sorry an error occurred: ${error}`);
})


//pass this line in make use of ejsMate package
//then create a folder in "views" called "layout", crate file "boilerplate.ejs" inside
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//This line ensures we can use js files in public directory
app.use(express.static(path.join(__dirname, 'public')));
//trigger middleware for flash
app.use(flash());

//Middleware to bring in passport, msake sure session setup before these lines of code
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Users.authenticate()));

//Methods describe HOW user added, removed from session
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//Pass in this middleaare to save you refactoring the flash message
app.use((req,res,next)=>{
    //Assign variable current user with req.user, and it can be passed into any template
    res.locals.currentUser=req.user;
    
    //Ensures "messages" as a variable gets passed into every route, without having to type it in each route
    res.locals.messages={};
    res.locals.messages.success=req.flash("success");
    res.locals.messages.warning=req.flash("error");
    console.log(res.locals.messages);
    next();
})

app.listen(3000,()=>{
    console.log("app open on port 3000");
})

//setup fake get route to create new user as test
app.get("/fakeUser",async(req,res)=>{
    //create new User object
    const user=new Users({
        email:"bassojack@gmail.com",
        username:"j_bass_1"
    })

    //then call register method passing in the user as argument and a passord,
    //which generates a new user object with hashed password
    const newUser= await Users.register(user,"JB_dogga13");

    //log user to test
    res.send(newUser);
})


//call app.use("/routeGroup",router). The prefix of "shelter" means we can remove it from the shelter.js page
app.use("/camp",campRouter);
app.use("/camp/:id/reviews",reviewRouter);
app.use("/",userRouter);




//setup route for user to add a review for a specific campground
// app.get("/camp/:id/review",async (req,res)=>{
//     //extract id from url
//     const {id}=req.params;

//     //find the camp based on id
//     const foundCamp= await campGround.findById(id);

//     //render a review ejs template, passing in foundCamp
//     res.render("campgrounds/review",{foundCamp});
// })




//The catch all route that runs if no route was found
app.all(/(.*)/,(req,res,next)=>{
    //basically calling our custom error
    next(new ExpressError("Page not found",500));
})

//setup the basic error handler
//add in standard error handling middleware at bottom
app.use((error,req,res,next)=>{
    //error here will refer to either built in error or custom one if we've called it
    //seetting default code to 500 unless otherwise specified
    let {status=500,message="Error encountered"}=error;
    res.status(status);
    if(status==500){
        status="five-0";
    }
    res.render("error",{error,status,message});
    next(error);
})



