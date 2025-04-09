var mongoose = require('mongoose');
const moment = require('moment-timezone');
const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const AccountSchema = new mongoose.Schema({
    
    username:{
        type:String,unique: true,
    },
    password:{
        type:String,
    },
    createdAt: {
        default: () => moment().tz("Asia/Bangkok").toLocaleString(),//correct
        required:true,type:String,
    },
    
});

const Account = db.db1.model("accounts", AccountSchema);
module.exports = Account;
