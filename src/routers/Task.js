const express = require('express')
const Task = require("../models/Task")
const authRequest = require("../middlewares/apiAuth")
const User2 = require("../models/User2")
const { findOneAndUpdate } = require('../models/Task')

const router = new express.Router()


//posttaskss...
router.post('/tasks',authRequest,async (req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.validUser._id
    })
    
    try{
        const saveTask = await task.save()
        res.status(201).send(saveTask)
    }
    catch(e){
        res.status(500).send(e)
    }
    // task.save()
    // .then(resp=>{res.status(200).send(task)})
    // .catch(e=>{res.status(500).send(e)})
    
})

//readin Tasks..

router.get("/tasks", authRequest, async(req,res)=>{
   const match ={}
   const sort ={}

   //this is for listout task according to status...
   const checkPara = req.query.status
   if(req.query.status){
       if(checkPara === "true"){
        match.status = true
        console.log("true setted")
       }else if(checkPara === 'false'){
           match.status = false
           console.log("false setted")
       }
   }


   //-1 for Desc Sorting and 1 for ASC sorting...
   if(req.query.sortBy){
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === "DESC" ? -1 : 1;
   }

    try{

        //modern_way...
        // const tasks = await Task.find({owner:req.validUser._id})
    // console.log(typeof match.status)
        await req.validUser.populate({
            path: 'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        //this gives you all available tasksss..
        // const tasks = await Task.find({})
        res.send(req.validUser.tasks)

    }catch(e){
        res.status(400).send(e)
    }

    // Task.find({}).then(task=>{
    //     res.send(task)
    // }).catch(e=>{
    //     res.status(400).send(e)
    // })
   
   })


   //Reading Task by ID;

   router.get('/tasks/:id', authRequest, async (req,res)=>{
      const _id = req.params.id
    try{
        //modernway
        const singleTask = await Task.findOne({_id, owner:req.validUser._id})
        //oldway
        // const singleTask = await Task.findById(req.params.id)
        if(!singleTask){
     
                 return res.status(400).send()
             }
             res.send(singleTask)
     }
     catch(e){
 
         res.status(500).send()
     }
    // Task.findById(req.params.id).then(task=>{
    //     if(!task){
    
    //         return res.status(400).send()
    //     }
    //     res.send(task)
    // }).catch(e=>{
    //     console.log(e)
    //     res.status(500).send()
    // })
})





//update for task....

router.patch("/tasks/:id",authRequest,async (req,res)=>{

    const incomingKeys = Object.keys(req.body)
    const allowedKeys = ['status','desc','heading','requiedReport']
    const isValidKeys = incomingKeys.every((key)=>{
        return allowedKeys.includes(key)
    })

    console.log(isValidKeys)
    if(!isValidKeys){
        res.status(400).send()
    }
    console.log(req.body)

    try{

        const updatedTask = await Task.findOne({_id:req.params.id, owner:req.validUser._id})
        //oldwaysss
        // const updatedTask = await Task.findById(req.params.id)
      
        if(!updatedTask){
            return res.status(404).send()
        }
        incomingKeys.forEach(key=>{
            updatedTask[key] = req.body[key]
        })
        
        await updatedTask.save() 

        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators :true})
        console.log(updatedTask)
        res.send(updatedTask)

    }
    catch(e){
        res.status(500).send()
    }

})



router.delete("/tasks/:id",authRequest,async (req,res)=>{
    try{

        const deletedTask = await Task.findOneAndDelete({_id:req.params.id, owner: req.validUser._id})
        if(!deletedTask){
            res.status(400).send()
        }
        
        res.send(deletedTask)

    }catch(e){
        res.status(500).send(e)
    }
})
 


//Most messy part.....
//this route basically performs how many user we want and assign them this task.
//tasks/ready/:id?onuser=6
//this url can be pointed to incomplted tasksss... we can authenti
router.post("/task/ready/:id", authRequest, async(req,res)=>{

const task = await Task.findOne({_id:req.params.id})
// console.log(task)
    const size = parseInt(req.query.onuser)
    try{
        // console.log("seettign")
        

        //getting  random pickss
        const agg = await User2.aggregate([{$sample:{size}}])
      

        //just itreating through id of random picks and asssigning Tasks...
     agg.forEach(async (doc)=>{ 
            let user2 = await User2.findOne({_id:doc._id})
            console.log(user2)
            user2.assignedTasks = await user2.assignedTasks.concat({task})
           await user2.save()        
        })
        res.status(200).send({agg})
    }catch(e){

    }

})

module.exports = router