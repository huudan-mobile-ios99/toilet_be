var mongoose = require('mongoose');
const moment = require('moment-timezone');
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const FeedbackCustomerV2Schema = new mongoose.Schema({
    
    statusName: {
        required: true,
        type: String,
    },

    customerNumber: {
        required: true,
        type: Number,
    },
    customerName: {
        required: true,
        type: String,
    },
    customerCode: {
        type: String,
    },
    customerNatinality: {
        required: true,
        type: String,
    },
    note: {
        required: true,
        type: String,
    },
    hasNote:{
        required :true,
        type:Boolean,
        default:false
    },
    service_good:{
        required:true,
        type: [String],
        default:[]
    },
    service_bad:{
        required:true,
        type: [String],
        default:[]
    },
    staffNameEn: {
        required: true,
        type: String,
    },
    staffName: {
        required: true,
        type: String,
    },
    staffCode: {
        required: true,
        type: String,
    },
    staffRole: {
        required: true,
        type: String,
    },
    createdAt: {
        default: () => moment().tz("Asia/Bangkok").toDate(),//correct
        required:true,type:Date,
    },
    updateAt: {
        default: Date.now(),
        type: Date,
    },
    tag:{
        type:String,
        default:"testing"
    }
    
});

const FeedbackCustomerV2 = db.db2.model("feedback_customers_v2", FeedbackCustomerV2Schema);
module.exports = FeedbackCustomerV2;
