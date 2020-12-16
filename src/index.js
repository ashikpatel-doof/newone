const express = require('express')
require("./db/mongoos.js")
const User = require("./models/User")
const Task = require("./models/Task.js")
const { ObjectID } = require('mongodb')
const { update, deleteOne } = require('./models/User')
const userRouter = require("./routers/User.js")
const taskRouter = require("./routers/Task")
const user2Router = require("./routers/User2")


const app = express()
const port = process.env.PORT || 8000

//when Your site is under Maintainace ...
// app.use((req,res,next)=>{
//     res.status(503).send("Hey There, We are temporarily unavailble due to mass Request.. We will come back to you shortly ")
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(user2Router)

app.listen(port, ()=>{
    console.log("runing on port ", port)
})


//endpoints... for UserApi
// get : /users
// get : /users/:id
// post : /users
// patch : /users/:id
// delete : /users/:id

//endpoints... for TaskApi
// get : /tasks
// get : /tasks/:id
// post : /tasks
// patch : /tasks/:id
// delete : /tasks/:id

//playground Area......

// const Task = require("../src/models/Task")

// const main = async ()=>{

//     // const task = await Task.findById("5fd6f8a2d40b77cf11b5fd41")
//     // await task.populate("owner").execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById("5fd6f5d949f7bb676714e978")
//     await user.populate("tasks").execPopulate()
//     console.log(user.tasks)
// }

// main()

// const mat = {}
// bod = "false"
// if(true){
//     mat.inc = bod === "true"
// }

// console.log(typeof bod)