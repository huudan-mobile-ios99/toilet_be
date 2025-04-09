var mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection

const UserSchema = new mongoose.Schema({
    
    username_en:{
        type:String,unique: true,
    },
    username:{
        type:String,unique: true,
    },
    image_url:{
        type:String,unique:true,
        default:"https://i.pinimg.com/564x/7f/c4/c6/7fc4c6ecc7738247aac61a60958429d4.jpg"
    },
    password:{
        type:String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    isActive:{
        type:Boolean
    }
})

const User = db.db1.model("users", UserSchema);
module.exports = User;
