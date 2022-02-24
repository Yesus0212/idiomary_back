'use strict'

const sgMail = require('../services/sendgrid');
require('dotenv').config();


async function registerMail(userName, email, testing = false) {
    
    const message = {
        to: email,
        from: process.env.MAIL_FROM,        
        subject: "Bienvenido a Idiomary!",
        text: "Bienvenido a Idiomary",
        html: `<h1>Hola ${userName}, muchas gracias por unirte a nuestra tripulación!</h1>`,
        mail_settings: {
            sandbox_mode: {
                enable: testing
            }
        }
    }

    try {
        await sgMail.send(message);
        return true;        
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = {
    registerMail
};