var mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const StaffSchema = new mongoose.Schema({
    code: {
        required:true,
        type:String, unique : true,
    },
    username_en:{
        required :true,
        type:String,unique: true,
    },
    username:{
        required : true,
        type:String,unique: true,
    },
    image_url:{
        type:String,
        default:"https://i.pinimg.com/564x/7f/c4/c6/7fc4c6ecc7738247aac61a60958429d4.jpg"
    },
    role: {
        required:true,
        type:String,
        default:"NOT FILL"
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    updateAt: {
        default: Date.now(),
        type: Date,
    },
    isActive:{
        type:Boolean,
        default:true,
    },

})

const Staff = db.db1.model("staffs", StaffSchema);
module.exports = Staff;
