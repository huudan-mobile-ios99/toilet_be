var mongoose = require('mongoose');
const moment = require('moment-timezone');
const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const FeedbackCustomerSchema = new mongoose.Schema({
    id:{
        required:true,type:Number,
    },
    content: {
        required: true,
        type: String,
    },
    experience:{
        required:true,
        type: [String],
        // type:String,
    },
    createdAt: {
        default: () => moment().tz("Asia/Bangkok").toLocaleString(),//correct
        required:true,type:String,
    },
    image:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/9/9a/No_avatar.png"
    },
    tag:{
        type:String,
        default:"testing"
    }
    
});

const FeedbackCustomer = db.db2.model("feedback_customers", FeedbackCustomerSchema);
module.exports = FeedbackCustomer;
