const cloudinary = require("cloudinary")
const multer = require("multer")
const cloudinaryStorage = require("multer-storage-cloudinary")
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret:process.env.api_secret
})

const storage = cloudinaryStorage({
    cloudinary,
    folder:"capstone",
    allowedFormats:['jpg','png'],
    filename: function (req, file, cb) {
        cb(undefined, file.originalname);
      }

})
const parser = multer({storage:storage})
module.exports = parser