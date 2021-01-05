const express = require('express')
const User = require("../models/User")
const authRequest = require("../middlewares/apiAuth")
const sharp = require("sharp")

const router = new express.Router()

router.get("/test",(req,res)=>{
    res.send("success")
})


const multer = require("multer")


router.post("/users/login",async (req,res)=>{
    try{
        // console.log("entering....")
        // console.log(req.body.email, req.body.password)
        
        const validatedUser = await User.validateUser(req.body.email.toLowerCase(), req.body.password)
        const token = await validatedUser.getAutoToken()

        res.send({validatedUser,token})
    }
    catch(e){
        res.status(400).send(e)

    }
})
//postUsers...
router.post('/users/signup',async (req,res)=>{

    const lowerEmail = req.body.email.toLowerCase()
    console.log(lowerEmail)
    const user = new User({
        email : lowerEmail,
        age : req.body.age,
        name : req.body.name,
        password : req.body.password
    })
    try{
        const saveUser = await user.save()
        const token = await saveUser.getAutoToken()
        res.status(201).send({saveUser,token})
    }
    catch(e){
        res.status(500).send(e)
    }
})

//Logging out ...

router.post("/users/logout", authRequest, async (req,res)=>{
    try{
        req.validUser.tokens = req.validUser.tokens.filter((token)=>{
            return token.token !== req.tokenFromAuthRequest
        })
           await req.validUser.save()
           res.send({msg:"Logged out ..."})
        
    }catch(e){
        res.status(500).send()
    }
    
})

//logging outAll

router.post("/users/logoutall", authRequest, async (req,res)=>{
try{
    req.validUser.tokens =[]
    await req.validUser.save()
    res.status(200).send({msg:"Looged out from all the devices ... "})
}
catch(e){
 res.status(500).send()
}
    
    
})
//reading Single Resource belong to user...
router.get("/users/me",authRequest,async(req,res)=>{

   res.send(req.validUser)
})

//reading.. GET users




//update op.. strict Mode

router.patch("/users/me", authRequest, async (req,res)=>{
    const  incomingKeys = Object.keys(req.body)
     const allowedKeys = ['age', 'name', 'password', 'email']
     //every func will set const true if all passed result returns true otherwise false
   const isValidKeys = incomingKeys.every((key)=>{
         
         //return only key avail in allowedkeys 
         return allowedKeys.includes(key)
     })
 
     console.log(isValidKeys)
     //check for not allowed field to change 
     if(!isValidKeys){
         return res.status(400).send()
     }
 
     // actual...
     try{ //we will firstfind the user if exist and then do something..

        const updatedUser = req.validUser

        //we are performing foreach so we have to access from []
        incomingKeys.forEach(key=>{
            updatedUser[key] = req.body[key]
        })
        await  updatedUser.save()



        //here findByIdAndUpdate bypass mongoose.
        //  const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        
         res.send(updatedUser)
         
     }catch(e){
         res.status(500).send(e)
     }
 })


//delete users

router.delete("/users/me",authRequest ,async (req,res)=>{
    try{

       await req.validUser.remove()
        
        res.send(req.validUser)

    }catch(e){
        res.status(500).send(e)
    }
})

//uploadinf files : and Here it is uploading Profile Photo of user
// const avatar = multer({
//     limits :{
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error("Please upload Image file having Extention of jpg,jpeg,png. "))
//         }
//         cb(undefined,true)
//     }
// })


// const imageChekingMiddlewar = (req,res)=>{
//     throw new Error("From Image Cheking Middlewaree")
// }


//uploading profie photo....
// router.post("/users/me/avatar", authRequest, avatar.single('avatar'), async (req,res)=>{

//     const user = await sharp(req.file.buffer).resize({width :250, height:250}).png().toBuffer()
//     req.validUser.avatar = user
//     await req.validUser.save()
//     res.status(200).send({msg:"saved Successfully//"})
// },(error,req,res,next)=>{
//     res.status(400).send({error : error.message })
// } )


// //delete Profile Photo
// router.delete("/users/me/deleteavatar", authRequest, async (req,res)=>{
//     req.validUser.avatar = undefined
//     await req.validUser.save()
//     res.send(200)
// })

// //seeing profile photo....

// router.get("/users/:id/avatar", async (req,res)=>{
//     try{
//         const user = await User.findById(req.params.id)
//         if(!user || !user.avatar){
//             throw new Error()
//         }
//         console.log("seting Contrnn")
//         res.set('Content-type', 'image/png')
//         res.send(user.avatar)

//     }catch(e){
//         res.status(400).send()
//     }
// })



module.exports = router