const express=require("express");

//import cloudinary module
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

//setting up config file with our cloudinary info
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//now create an instance of the config
const cloudStorage=new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ["jpeg","jpg","png"]
    }
})

//export the cloudinary package and storage variable
module.exports={
    cloudinary,
    cloudStorage
}