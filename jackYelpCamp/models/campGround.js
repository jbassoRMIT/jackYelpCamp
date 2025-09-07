//Creating a model forn the campground
const mongoose=require("mongoose");
const Reviews = require("./review");
const Users=require("./user");
const {Schema}=mongoose;

//define schema
//Updating schema to include an single author, with ref to users model
const campSchema=new Schema({
    title:String,
    price:{
        type:Number,
        min:0
    },
    description:String,
    location:String,
    images:[{
        url:String,
        filename:String
    }],
    author:{type:Schema.Types.ObjectId,ref:"Users"},
    reviews:[{type:Schema.Types.ObjectId,ref:"Reviews"}]
})

//Implementing delete query middleware. if post will run after "findOneAndDelete" runs
campSchema.post("findOneAndDelete",async function(camp){
    //test if a camp was actually found in delete operation
    if(camp){
        // delete from Reviews model where id matches whats in delete4d campground
        await Reviews.deleteMany({_id:{$in:camp.reviews}})
    }
})

//define model from schema
const campGround= mongoose.model("Campground",campSchema);

//export
module.exports=campGround;

