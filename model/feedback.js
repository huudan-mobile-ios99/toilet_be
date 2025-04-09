var mongoose = require('mongoose');
const moment = require('moment-timezone');

const { ObjectId } = mongoose.Types;
var db = require('../config_mongodb/configmain'); // Import the MongoDB connection


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
    // trip:{
    //     type: ObjectId, // Reference the Driver schema by ObjectId
    //     ref: 'Trip', // Set the reference to the 'Driver' model
    // },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trips', // Make sure it matches the model name 'trips' defined in mongoose.model
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

const FeedBacks = db.db1.model("feedbacks", FeedBackSchema);
module.exports = FeedBacks;
