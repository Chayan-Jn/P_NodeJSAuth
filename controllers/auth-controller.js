const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register endpoint
const registerUser = async(req,res)=>{
    try{
        // extract user info from req.body
        const {username,email,password,role} = req.body;
        // check if the user already exists in the db
        const checkExistingUser = await User.findOne({$or:[{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message:'A User already exists with with the same email or username'
            })
        }

        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)
        const newlyCreatedUser = new User({
            username,
            email,
            password:hashedPassword,
            role: role || 'user'
        });
        await newlyCreatedUser.save();
        res.status(200).json({
            success:true,
            message:"user created successfully ",
            data:newlyCreatedUser
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error occured'
        })
    }
}


// login controller
const loginUser = async(req,res)=>{
    try{
        // .find returs [] if not found. user.length==0
        // .findOne returns null . !found
        const {username,password} = req.body;
        console.log('body is ',req.body)
        // find if the user exists
        const userExists = await User.findOne({username});
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"Username doesnt exist",
            })
        }
        //check if the user password is correct
        const isPasswordMatch = await bcrypt.compare(password,userExists.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid username or password ",
            })
        }
        // JSON Web Token (JWT) is a compact(short), URL-safe(can be included in url) means of representing
        // claims(info) to be transferred between two parties
        // create user token
        const accessToken = jwt.sign({
            userId:userExists._id,
            username:userExists.username,
            role:userExists.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'50m'
        })
        res.status(200).json({
            success:true,
            message:'Logged in successfully',
            accessToken
        })


    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error occured'
        })
    }
}

const changePassword = async(req,res)=>{
    try{
        console.log('req is',req.userInfo)
        const userId = req.userInfo.userId;
        // extract old and new passwords(from frontend)
        console.log('req body is ',req.body)

        const {oldPassword,newPassword} = req.body;

        // find the current logged in user
        const user = await User.findById(userId);
        if(!user){
            res.status(400).json({
                success:false,
                message:'User not found'
            })
        }

        // check if the old password is valid
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Old password is not correct. Try again"
            })
        }

        // hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt);
        // Update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })

    }
    catch(e){
            console.log(e);
            res.status(500).json({
                success:false,
                message:'Some error occured'
            })
        }
    }


module.exports = {registerUser,loginUser,changePassword};