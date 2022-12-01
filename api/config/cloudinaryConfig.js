require('dotenv').config();
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const md5 = require("md5");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storageBookCover = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "audiobook/bookcover",
        public_id: (req, file) => md5(JSON.stringify(file)),
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const storageAvatar = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "avatar",
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const storagePage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "audiobook/page",
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadBookCover = multer({ storage: storageBookCover });
const uploadAvatar = multer({ storage: storageAvatar });
const uploadPage = multer({ storage: storagePage });

module.exports = {uploadBookCover, uploadAvatar, uploadPage, cloudinary};