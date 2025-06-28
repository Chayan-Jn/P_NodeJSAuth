const mongoose = require('mongoose');

const connectToDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connection successful")
    }
    catch(err){
        console.log('Err connecting to db ',err);
        process.exit(1);
    }
}

module.exports = connectToDB;