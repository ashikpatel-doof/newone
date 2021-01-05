const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { urlencoded } = require("express")
const Task = require("../models/Task")


const userSchema = new mongoose.Schema({
    
    name :{
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    age : {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error ("Value Must be positive..")
            }
        }
    },
    password :{
        type : String,
        trim :true,
        required : true,
        minLength : 6,
        validate(value){
            if(!validator.contains('password')){
                throw new Error("Please Use anothr Password")
            }
        }
    },
    email :{
        type: String,
        required : true,
        trim : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Email is not valid....")
            }
        }

    },
    tokens : [
        {
                token:{
                     type:String,
                        required : true
                }
         }      
         ],
  
} ,{
    timestamps : true
})


userSchema.virtual('tasks',{
    ref: "Task",
    localField : "_id",
    foreignField : "owner"
})

//called only once - and generate tokens for login and signup..
userSchema.methods.getAutoToken = async function(){
    console.log("Starting Assigning Atuhentication Token")
    user = this
    const token = await jwt.sign({_id:user._id.toString()}, 'thisisfirstclass')
    user.tokens = user.tokens.concat({token})
    await user.save()
    console.log("Token Has been Assigned..")
    return token
}


//this code provides that before passing data to client we hide few vulnerebal data...
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}


//Cutome Validation though middleware eith func using statics

userSchema.statics.validateUser = async (email,password)=>{

    console.log("starting")
    console.log(typeof email)
    const user = await User.findOne({email})  
    console.log(user)
    if(!user){
        throw new Error ("wrong email")
    }
    console.log("passed..")
    const correctPassword = await bcrypt.compareSync(password, user.password)
    if(!correctPassword){
        console.log("wrong password")
     throw new Error ("wrong password")
    }
    return user
}




//hassing the password if it is modified....or new request...
userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()

})

userSchema.pre('remove', async function(next){
    user = this
    console.log("Please wait we are removing your associated Tasks too..")
    await Task.deleteMany({owner:user._id})
    console.log("Success.. we have removed Your associated Tasks")
    next()
})
const User = mongoose.model("User", userSchema)

module.exports = User