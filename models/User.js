const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'], // the enum property is used as a validator to restrict a field's value to a specific set of allowed values. For your example:
        default:'true'
    }
},{timestamps:true}); // The option { timestamps: true } in a Mongoose schema automatically adds two fields to each document: createdAt and updatedAt

module.exports = mongoose.model('User',userSchema)