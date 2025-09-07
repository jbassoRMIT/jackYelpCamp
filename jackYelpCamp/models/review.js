//Creating a model forn the campground
const mongoose=require("mongoose");
const {Schema}=mongoose;

//import Users model
const Users=require("./user");

//define schema
const reviewSchema=new Schema({
    rating:Number,
    body:String,
    author:{type:Schema.Types.ObjectId,ref:"Users"}
})

//define model from schema
const Reviews= mongoose.model("Reviews",reviewSchema);

//export
module.exports=Reviews;

