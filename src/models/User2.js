const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const { Timestamp } = require("mongodb")
const User = require("./User")
const jwt = require('jsonwebtoken')


const user2Schema = new mongoose.Schema({
    name :{
        type : String,
        required :true,
        lowercase : true,
        trim : true,  
    },
    email :{
        type : String,
        required: true,
        trim: true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Sorry Please Enter Valid Email ID.")
            }
        }
    },
    password :{
        type : String,
        required : true,
        minlength : 6,
        validate(value){
            if(!validator.contains('password')){
                throw new Error('"password" cannot be used as password...')
            }
        }
    },
    age :{
        type : Number,
        required : true,
        validate(value){
            if(value<0){
                throw new Error("Age should be positive Number...")
            }
        }
    },
    tokens :[
        {
            token: {
                type : String,
                required :true
    
            }
        }
       
    ],
    assignedTasks :[
        {
            task: {
                type : Object,
            }
        }
       
    ]
}, {Timestamp:true})


user2Schema.methods.getAutoToken2 = async function(){
console.log("starting assigning token ")
 const user2 = this 
 console.log(user2)
 console.log("before assigenment of token")
 const token = await jwt.sign({_id:user2._id.toString()}, "thisissecondclass")
 
 user2.tokens = user2.tokens.concat({token})
 await user2.save()
console.log('Token hasbeen Assigened...')
return token
}

user2Schema.statics.validateUserFirst = async (email,password)=>{

    console.log("starting")
    console.log(typeof email)
    const user = await User2.findOne({email})  
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
    console.log("Login authenticated SUCCESFULL")
    return user
}

user2Schema.methods.toJSON = function (){
    const user2 = this
    const user2Object = user2.toObject()
    delete user2Object.password
    delete user2Object.tokens
    return user2Object
}

user2Schema.pre('save', async function(next){
  const user2 = this
    if(user2.isModified('password')){
       user2.password = await bcrypt.hash(user2.password,8)
    }
    next()
})


const User2 = mongoose.model("User2",user2Schema)

module.exports = User2