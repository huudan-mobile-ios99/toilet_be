var mongoose = require('mongoose');
const moment = require('moment-timezone');

var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const { ObjectId } = mongoose.Types;

const CheckListSchema = new mongoose.Schema({
    
    title:{
        required:true,type:String
    },
    body:{
        required:true,type:String,
    },
    username:{
        required:true,type:String,
    },
    username_en:{
        required:true,type:String
    },
    is_finish:{
        required:true,default:false,type:Boolean
    },
    createdAt: {
        default: () => moment().tz("Asia/Bangkok").toLocaleString(),//correct
        required:true,type:String,
    },
    updateAt:{
        default: () => moment().tz('Asia/Singapore'), 
        type: Date,
    }


})

const CheckList = db.db1.model("checklists", CheckListSchema);
module.exports = CheckList;
