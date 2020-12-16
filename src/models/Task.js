const mongoose = require("mongoose")
const User = require("../models/User")



taskSchema = new mongoose.Schema({
    heading : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        trim : true,

    },
    status : {
        type : Boolean,
        default : false,
    },
    requiredReport : {
        type : Boolean,
        required : true
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    }
},{
    timestamps: true
})

const Task = mongoose.model("Task",taskSchema)

module.exports = Task