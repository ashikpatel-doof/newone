const sgMail = require("@sendgrid/mail")

// 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

const api = "" //Provide Key heee

sgMail.setApiKey(api)


const sendWelcomeMailNow = (email,name)=>{
    sgMail.send({
        from : "ashikpatelderivedweb@gmail.com",
        to:email,
        subject : "Thanks for Joining..",
        text : `Hello, ${name} we are glad you choose to go with us, Let's do that...`
    }).then(res =>{console.log(res)}).catch(err=>{console.log(err)})
}

module.exports = {
    sendWelcomeMailNow
}