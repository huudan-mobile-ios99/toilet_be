var mongoose = require('mongoose');
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection
const moment = require('moment-timezone');
const { ObjectId } = mongoose.Types;

const FeedBackSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String,
    },
    driver:{
        required:true,type:String
    },
    
    star: {
        required: true,
        type: Number,
    },
    //content:'i so happy when i had that ride'
    content: {
        required: true,
        type: String,
    },
    //experience:[good,friendly,ok,happy]
    experience:{
        required:true,
        type: [String],
        // type:String,
    },
    //check if else the process is true or false
    isprocess: {
        required: true,
        type: Boolean,
        default: false,
    },

    //procress time
    processcreateAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() + 7);
            return now;
        },
    },
    createdAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() + 7);
            return now;
        },
    },
})

const FeedBacks = db.db1.model("feedback2s", FeedBackSchema);
module.exports = FeedBacks;
