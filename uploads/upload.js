//IMAGE UPLOAD
const multer = require("multer");
const mongoose = require('mongoose');

const util = require("util");
const { GridFsStorage } = require('multer-gridfs-storage');
const config = require('./config')
const currentDate = new Date().toISOString().substring(0, 10)
// Generate a unique identifier function
const generateUniqueIdentifier = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

var storage = new GridFsStorage({
  url: config.URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  
  file: (req, file) => {
    const originalname = file.originalname;
    // const sanitizedFileName = originalname.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, ' ');
    // console.log(originalname);
    const match = ["image/png", "image/jpeg", "image/jpg", "image/heic"];
    if (match.indexOf(file.mimetype) === -1) {
      // const filename = `${currentDate}_${sanitizedFileName}`;
      // console.log(`file name: ${filename}`)
      const uniqueIdentifier = generateUniqueIdentifier();
      const filename = `${originalname}${uniqueIdentifier}`;
      return {
        bucketName: config.imgBucket,
        filename: filename
      };
    }
    return {
      bucketName: config.imgBucket,
      filename: originalname
    };
  }
});


const storage2= new GridFsStorage({
    url: config.URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg","image/jpg","image/heic"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "images",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});
module.exports = multer({ storage2 });

module.exports = multer({ storage });





var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware
