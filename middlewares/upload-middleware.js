const multer = require('multer');
const path = require('path');

// set multer storage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        cb(null,
            file.fieldname + '-' + 
            Date.now() + path.extname(file.originalname)
        )
    }
});

// file filer function
const CheckFileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new Error('Not an image: Please upload an image '))
    }

    // What is file.mimetype?
    // Mimetype (or MIME type) is a standard way to identify the type of a file on the internet.
    // Examples:
    //     image/jpeg for JPEG images
    //     image/png for png
    //     text/plain for plain text files
}

// multer middleware
module.exports = multer(
    {
        storage:storage,
        fileFilter:CheckFileFilter,
        limits:{
            fileSize:5*1024*1024 // 5Mb
        }
    }
)








// file.fieldname: The name of the form field that contained the file.
// ex <input type="file" name="profilePicture">

// '-': A hyphen separator.

// Date.now(): The current timestamp (to make the filename unique).

// path.extname(file.originalname): The file extension from the original filename (e.g., .jpg, .png).
