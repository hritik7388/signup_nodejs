const nodemailer = require('nodemailer')
module.exports = ({
    generateOTP: () => {
        let random = Math.random()
        let generatedOTP = Math.floor(random * 10000) + 100000
        return generatedOTP
    },
    sendMailing: async (email, subject, text) => {
        try {
            const emailTransporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: true,
                auth: {
                    user: "choreohritik52@gmail.com",
                    pass: "lgva goql ihvw tjdg",
                },
            })
            const  mailOptions = {
                from: "no-replymailer@mobiloitte.com",
                to:email,
                subject: subject,
                text: text,
                
            }
        return await emailTransporter.sendMail(mailOptions)
        } catch (error) {
            console.log(error.message)

        }
    },
    
})