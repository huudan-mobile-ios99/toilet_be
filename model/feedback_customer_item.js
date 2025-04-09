var mongoose = require('mongoose');
const moment = require('moment-timezone');
const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection


const FeedbackCustomerItemSchema = new mongoose.Schema({
    id:{
        required:true,type:Number,
    },
    content: {
        required: true,
        type: String,
    },
    image:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/9/9a/No_avatar.png"
    },
    createdAt: {
        default: () => moment().tz("Asia/Bangkok").toLocaleString(),//correct
        required:true,type:String,
    },
    
});

const FeedbackCustomerItem = db.db2.model("feedback_customer_items", FeedbackCustomerItemSchema);
module.exports = FeedbackCustomerItem;
