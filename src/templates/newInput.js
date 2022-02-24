'use strict'

const sgMail = require('../services/sendgrid');
require('dotenv').config();


async function newInput(userName, email, testing = false) {
    
    const message = {
        to: email,
        from: process.env.MAIL_FROM,        
        subject: "Hemos recibido tu solicitud como traductor",
        text: "Solicitud como traductor recibida!",
        html: `<h1>Hola ${userName}, estamos evaluando tu nueva definición. Cuando hayamos terminado podrás observarla
        en el apartado de tus aportes. O directamente al buscarla en "Lo nuevo"</h1>`,
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

async function newStatusInput(userName, email, status, testing = false) {
    
    const messageAccept = {
        to: email,
        from: process.env.MAIL_FROM,        
        subject: "Aporte autorizado!",
        text: "Tu solicitud como traductor, ha sido aceptada!",
        html: `<h1>Muchas gracias ${userName}, tu aporte nos ayudará a enternos mejor!.</h1>`,
        mail_settings: {
            sandbox_mode: {
                enable: testing
            }
        }
    }

    const messageReject = {
        to: email,
        from: process.env.MAIL_FROM,        
        subject: "Aporte rechazado!",
        text: "Tu intento como traductor, ha sido rechazado!",
        html: `<h1>Lo sentimos ${userName}, tu aporte fue rechazado!</h1>`,
        mail_settings: {
            sandbox_mode: {
                enable: testing
            }
        }
    }

    const finalMessage = status === 2? messageAccept: messageReject;


    try {
        await sgMail.send(finalMessage);
        return true;        
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = {
    newInput,
    newStatusInput
};