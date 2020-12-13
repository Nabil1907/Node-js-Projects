
// // using Twilio SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRID_API_KEY)
// sgMail.setApiKey('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');
// const msg = {
//   to: 'snabil084@gmail.com',
//   from: 'nabil_salman1999@yahoo.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, nodeeven with Node.js</strong>'
// };
// sgMail.send(msg)
// .catch(err=>{
//     console.log(err)
// }) ;


const nodemailer = require('nodemailer');

const sendMailer = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendMailer({
   auth : { 
    api_key:'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'
    }
}));
transporter.sendMail({
    to:'nabilfcih1907@gmail.com',
    from:'snabil084@gmail.com',
    subject:'SignUp Succeeded',
    html:'<h1> You Successfully sign up !</h1>'
}).catch(err=>{
    console.log(err)
})