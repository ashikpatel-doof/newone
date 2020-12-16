const express = require('express')
const { default: validator } = require('validator')
const User2 = require("../models/User2")
const Task = require("../models/Task")
const authRequest = require('../middlewares/apiAuth2')
const authRequest2 = require('../middlewares/apiAuth2')
const { response } = require('express')


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



//getting all users for testing, but will be deprecated after successfull build..
router.get("/user2s",authRequest2, async (req,res)=>{

    const users2 = await User2.find({})
        res.send(users2)
})
router.get("/user2s/:id",authRequest2, async (req,res)=>{

    // console.log(req.params.id)
    try{
        const users2 = await User2.findOne({_id:req.params.id})
        // console.log(users2)
        // console.log("TJSHIHS...",users2[0].assignedTasks)
        res.send(users2.assignedTasks)

    }catch(e){
        res.status(500).send({err:"It seems you dont have any task"})
    }
   
})
module.exports = router