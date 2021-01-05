const { ObjectID } = require("mongodb")
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
    isassigned:{
        type : Boolean,
        required: true,
        default : false
    },
    maxage :{
        type : Number,
        default:60,
        required : true
    },
    minage :{
        type : Number,
        default : 18,
        required : true,
    },
    questions:[
        {
            question:{
                type:String,
                required : true,
                trim :true
            },
            truecase :[
                {
                    case : {
                    type :String,
                    require : true,
                    trim : true
                    }
                }
            ],
            falsecase : [
                {
                    case : {
                    type :String,
                    require : true,
                    trim : true
                    }
                }

            ]
        }
    ],
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    doneBy : {
        type : Array
    },
    counter :{
        type : Number
    }
},{
    timestamps: true
})

const Task = mongoose.model("Task",taskSchema)

module.exports = Task