const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    publicId:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{timestamps:true})

module.exports = mongoose.model('Image',imageSchema);
// The ref field is used to create a reference to another model in Mongoose.
// ref: 'User' tells Mongoose that the ID refers to a document in the User collection (based on a Mongoose model named 'User').