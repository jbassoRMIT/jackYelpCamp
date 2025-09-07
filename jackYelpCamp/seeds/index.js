//use this file to feed data into db
//connect to mongoose
const mongoose=require("mongoose");
const { type } = require('os');
mongoose.connect('mongodb://127.0.0.1:27017/jackYelpApp') //mongo by default uses port 127.0.0.1:27017, name will be "shopApp"
.then(()=>{
    console.log("connection open!");
})
.catch((error)=>{
    console.log(`Sorry an error occurred: ${error}`);
})

//import model
const campGround=require("../models/campGround");

//import cities.js
const cities=require("./cities");
//import the arrays from seedHelpers.js
const {descriptors,places}=require("./seedHelpers");

//write a function that takes an array as arg and returns a random element
const sample=function(array){
    let arrayLength=array.length;
    let r=Math.floor(Math.random()*arrayLength);
    return array[r];
}

//clear existing entries
const campDB=async function(){
    await campGround.deleteMany({});
    // const p= new campGround({
    //     title:"star wars yoooo"
    // })
    // p.save()
    // .then((data)=>{
    //     console.log(data)
    // })
    
    //The idea here is we loop 50 times if we want 50 objects in our database
    //Update seed function so every entry has authorID=my user ID (to test)
    for(let i=0;i<50;i++){
        //get a random integer between 1 and 1000 because there are 1000 entries in cities.js
        let r=Math.floor(Math.random()*1000);

        //create random number for price between 10-30
        let p=Math.floor(Math.random()*20+10);
        //create new object
        const camp=new campGround({
            location:`${cities[r].city}, ${cities[r].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            price:p,
            author:"68b626eba6a83cc76a30fa31",
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ipsam nobis cupiditate voluptas quibusdam harum deleniti consectetur quod nisi totam. Ea laborum possimus dignissimos commodi cupiditate temporibus enim consequuntur tempora.",
            image:`https://picsum.photos/400?random=${Math.random()}`
        })
        //run this to test
        await camp.save();
    }
}

//Good practice to close connection after done
campDB()
.then(()=>{
    mongoose.connection.close()
});
