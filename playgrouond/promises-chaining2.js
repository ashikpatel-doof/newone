require("../src/db/mongoos")
const Task = require("../src/models/Task")

// Task.findByIdAndRemove("5fd1a3498515101e8ba97b3d").then(res=>{
//     return Task.countDocuments({status: false})
// }).then(incomplete=>{
//     console.log("total Number of incompleted task is.. ", incomplete)
// })

const deleteAndCount = async (id)=>{
    const del = Task.findByIdAndRemove(id)
    const count = Task.countDocuments({status:false})
    return count
}

deleteAndCount("5fd1e16b929d9c18295d836d").then(count=>{
    console.log(count)
}).catch(e=>{
    console.log(e)
})