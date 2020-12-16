const User = require("../models/User")
const jwt = require('jsonwebtoken')
const { compareSync } = require("bcryptjs")
const { default: validator } = require("validator")

//authenctication for incoming request ..
const authRequest = async (req,res,next)=>{
    try{

        
    const tokenFromRequest = req.header('Authorization').replace("Bearer ",'')
    const decodedUsingJwt = await jwt.verify(tokenFromRequest, "thisisfirstclass")
    const validUser = await User.findOne({_id: decodedUsingJwt._id, 'tokens.token': tokenFromRequest})
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

module.exports = authRequest