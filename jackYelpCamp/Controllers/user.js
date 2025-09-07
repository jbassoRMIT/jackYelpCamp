//This file stores the functions related to users that get passed into the routes, for code cleanliness

//Import users model
const Users=require("../models/user");

//Function to show form to register new user
module.exports.registerUserForm=(req,res)=>{
    res.render("users/register")
}

// Function to post a new user
module.exports.registerUser=async(req,res)=>{
    //wrap it all in a try/catch block to produce custom message through flash, 
    // and redirects user back to register page if login fails
    try{
        //Extract variables from req.body
        const{email,username,password}=req.body.user;
        
        //create new User object
        const user=new Users({email,username});

        //then call register method passing in the user as argument and a passord,
        //which generates a new user object with hashed password
        const newUser= await Users.register(user,password);

        //Now once we create a registered user, we need to call the req.login function, 
        // otherwise they have to sign themselves in
        req.login(newUser,error=>{
            if(error){
                return next(error);
            }
            //send a successful flash message
            req.flash("success","Well done you successfully registered and are logged in")

            //redirect to campgrounds home
            res.redirect("/camp");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
}

//Function to show login page
module.exports.loginUserForm=(req,res)=>{
    res.render("users/login");
}

//Function to post login 
module.exports.completeLogin=(req,res)=>{
    req.flash("success","Welcome back!");
    console.log(req.session);

    const redirectUrl=res.locals.returnTo || "/camp";

    //redicrect to campgrounds
    res.redirect(redirectUrl);
}

//Function to logout a user
module.exports.logout=(req,res)=>{
    //call the inbuilt passport method for req.logout
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/camp');
    });
}