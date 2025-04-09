var mongoose = require('mongoose');
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const ImageSchema = new mongoose.Schema({
   caption: {
        required: true,
        type: String,
    },
     fileId: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    },
   
    createdAt: {
        default: Date.now(),
        type: Date,
    },
})

const Images = db.db1.model("image", ImageSchema);
module.exports = Images;
