//import express and router
const express=require("express");
//mergeParams is how you indicate pass on params from index file. 
const router=express.Router({mergeParams:true});

//import passport
const passport=require("passport");

//Import user controller
const userController=require("../Controllers/user.js");

//import store ReturnTo function
const{storeReturnTo}=require("../middleware");

//import user model
const Users=require("../models/user");

//import wrapAsync function
const wrapAsync=require("../utilities/catchAsync");

//GET request to register a new user
router.get("/register",userController.registerUserForm);

//Create post route to capture form data and add new user to database
router.post("/register",wrapAsync(userController.registerUser));

//GET request for user login
router.get("/login",userController.loginUserForm);

//Create post route to capture form data from login, and authenticate user
//pass in as middleware function passport.authenticate
//failureFlash:true - flash an error if theres an error
//failureRedirect:"/login" - redirect to login if authentication error arises
router.post("/login",storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.completeLogin);

//Create a get route for logging out
router.get("/logout",userController.logout);

module.exports=router;