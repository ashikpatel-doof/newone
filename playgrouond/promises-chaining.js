//promise chaining means calling other promises in the resulting promises..

require("../src/db/mongoos")
const User = require("../src/models/User")


// User.findByIdAndUpdate("5fd1b7bfcae5e347fd0aae27",{age : 1}).then(user=>{
//     console.log(user)
//     return User.countDocuments({age:24})
// }).then(count=>{
//     console.log(count)
// }).catch(e=>{
//     console.log(e)
// })



const updateAndCount = async (id,age)=>{

    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return ({ user : user,
            count :count })
}

updateAndCount("5fd1b7bfcae5e347fd0aae27", 30).then(res=> {
    console.log(res)
}).catch(e=> {
    console.log(e)
})