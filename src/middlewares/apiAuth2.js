const User2 = require("../models/User2")
const jwt = require('jsonwebtoken')
const { compareSync } = require("bcryptjs")
const { default: validator } = require("validator")

//authenctication for incoming request ..
const authRequest2 = async (req,res,next)=>{
    try{

        console.log("starting authentication..")
    const tokenFromRequest = req.header('Authorization').replace("Bearer ",'')
    console.log(tokenFromRequest)
        
    const decodedUsingJwt = await jwt.verify(tokenFromRequest, "thisissecondclass")
    console.log(decodedUsingJwt)
    const validUser = await User2.findOne({_id: decodedUsingJwt._id, 'tokens.token': tokenFromRequest})
    console.log(validUser)
    // console.log("token....",tokenFromRequest)
    // console.log("DecodedUse...",decodedUsingJwt)
    // console.log("FoundedUser..", validUser)
    if(!validUser){
        throw new Error()
    }
    req.tokenFromAuthRequest = tokenFromRequest
    req.validUser = validUser
    console.log("Done Authenticatio Process of..", validUser.name)
    next()

    }catch(e){
        res.status(500).send({error:"Sorry We are not able to provide you resource..."})
    }
    
}

module.exports = authRequest2