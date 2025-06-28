const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary')
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper')
const fs = require('fs')

const uploadImageController = async(req,res)=>{
    try{
        // check if file is missing in req object
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:'File is required'
            })
        }
        // upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);
        // store the image url and public id along with id of uploader in the db
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId
        });
        await newlyUploadedImage.save()
        
        // delete the file from local storage
        // unlinkSync cannot delete directories—it throws an error if you try
        //rmSync can delete directories (even non-empty // ones, with the recursive option)

        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success:true,
            message:"Image uploaded successfully "
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Something went wrong.Please try again'
        })
    }
}

const fetchImagesController = async (req,res)=>{
    try{
        // add pagination and sorting also
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder ==='asc' ? 1:-1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);
    
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        // const images = await Image.find({});
        if(images){
            res.status(200).json({
                success:true,
                message:"Fetched the images successfully ",
                currentPage:page,
                totalPages:totalPages,
                totalImages:totalImages,
                data:images
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Something went wrong.Please try again'
        })
    }
}

const deleteImageController = async(req,res)=>{
    try{
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
        if(!image){
            return res.status(404).json({
                success:false,
                message:"Image not found"
            })
        }

        // check if the Uploader and the deleter is same

        //  when you get the userId from the frontend or from a JWT, it’s usually a string so we use toString().
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:true,
                message:"You are not allowed to delete this"
            })
        }

        // delete the image
        // 1. from cloudinary
        // 2. mongodb
        // public id is required to delete the image
        await cloudinary.uploader.destroy(image.publicId);
        // now from mongodb
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);
        res.status(200).json({
            success:false,
            message:"Image deleted successfully"
        })


    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Something went wrong.Please try again'
        })
    }
}
module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}