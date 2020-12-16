const mongoose = require("mongoose")

//Connections Setup
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology: true
})


// const Task = mongoose.model("Task",{
//     heading : {
//         type : String,
//         required : true
//     },
//     desc : {
//         type : String,
//         trim : true,

//     },
//     status : {
//         type : Boolean,
//         default : false,
//     },
//     requiedReport : {
//         type : Boolean,
//         required : true
//     }
// })


// const task = new Task({
//     heading: 'Serachengine Cheking..',
//   desc: 'Search Product',
//   status: false,
//   requiedReport: true
// }).save().then(res=>{console.log(res)}).catch(e=>{console.log(e)})

