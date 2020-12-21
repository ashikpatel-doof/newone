const express = require('express')
const { default: validator } = require('validator')
const User2 = require("../models/User2")
const Task = require("../models/Task")
const authRequest = require('../middlewares/apiAuth2')
const authRequest2 = require('../middlewares/apiAuth2')
const { response } = require('express')
const { update } = require('../models/Task')
const User = require('../models/User')
const {sendWelcomeMailNow} = require("../emails/account")


const router = new express.Router()

router.get("/user2Test",(req,res)=>{
    res.send("RECIVING........")
})


//Normal User Creattion...
router.post("/user2/signup", async(req,res)=>{

    const email = req.body.email.toLowerCase()
    const user2 = new User2({
        name : req.body.name,
        email : email,
        password : req.body.password,
        age : req.body.age
    })
 
    try{
        console.log("enetring before sve in route")
        const savedUser2 = await user2.save()
        // sendWelcomeMailNow(savedUser2.email, savedUser2.name)
        console.log(savedUser2)
        const token = await savedUser2.getAutoToken2()
        res.status(200).send({savedUser2, token})
    }catch(e){
        res.status(500).send({erorrMsg : "Aghh, Please Check the details or email might already exist.."})
    }
})

//user gets loggedin and getting token for further use of app
router.post("/user2/login", async (req,res)=>{
    try{
        // console.log("entering Auth...")
        const validatedUser2 = await User2.validateUserFirst(req.body.email.toLowerCase(), req.body.password)
        const token = await validatedUser2.getAutoToken2()
        res.status(201).send({validatedUser2, token})

    }catch(e){
        res.status(500).send(e)
    }
})

router.post("/user2s/logout", authRequest2, async (req,res)=>{
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


//getting User2's profile
router.get("/user2s/me",authRequest2,async(req,res)=>{

    res.send(req.validUser)
 })



//getting all users for testing, but will be deprecated after successfull build..
router.get("/user2s",authRequest2, async (req,res)=>{

    const users2 = await User2.find({})
        res.send(users2)
})


router.patch("/user2s/me", authRequest2, async (req,res)=>{
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
router.get("/user2s/:id",authRequest2, async (req,res)=>{

    // console.log(req.params.id)
    try{
        const users2 = await User2.findOne({_id:req.params.id})
        // console.log(users2)
        // console.log("TJSHIHS...",users2[0].assignedTasks)

        // console.log(users2.assignedTasks.task._id)
        console.log(users2.assignedTasks[0].task.desc)
        res.send(users2.assignedTasks)

    }catch(e){
        res.status(500).send({err:"It seems you dont have any task"})
    }
   
})


//once user submit the end of task....
//user2s/submit/{taskid}
router.post("/user2s/submit/:id", authRequest2, async(req,res)=>{
    try{
        console.log("entering..")
        const taskToUpdate = await Task.findOne({_id:req.params.id})

        taskToUpdate.counter = taskToUpdate.counter + 1;
        taskToUpdate.doneBy.push(req.validUser._id)
        // console.log(taskToUpdate.doneBy)
        
      const tasks = await req.validUser.assignedTasks.filter(element => {
          return element.task._id.toString() !== req.params.id
        });
        
        req.validUser.assignedTasks = tasks
       await req.validUser.save()
       await taskToUpdate.save()
        
    //    console.log(taskToUpdate)
        // console.log("counter:", taskToUpdate.counter)
        // console.log(typeof taskToUpdate.doneBy)

        // console.log(taskToUpdate)
        res.send({taskToUpdate})
    }catch(e){
        res.status(400).send({e})

    }
    
})



module.exports = router