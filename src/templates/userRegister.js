'use strict'

const nodemailer = require('nodemailer');
require('dotenv').config();


function registerMail(userName) {

    console.log(userName, "nombre del usuario")
    
    const transport = nodemailer.createTransport({
        host: process.env.SES_HOST,
        port: process.env.SES_PORT,
        auth: {
          user: process.env.SES_USER,
          pass: process.env.SES_PASS
        }
    });
    
    const message = {
        from: "jesussolispadron@gmail.com",
        to: "jesussolispadron@gmail.com",
        subject: "Prueba de envio",
        html: `<h1>Hello ${userName} Email</h1>`
    }

    transport.sendMail(message, (error, info) => {
        if(error)
            console.log(error)
        else
            console.log(info)
    })
}


module.exports = {
    registerMail
};