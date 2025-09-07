//Create a user model with just email field
// remember to import mongoose and passport-local-mongoose
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const {Schema}=mongoose;
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(passportLocalMongoose);

//create model for users
const Users=mongoose.model("Users",userSchema);

//export model
module.exports=Users;
