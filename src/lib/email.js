const nodemailer = require('nodemailer');

function createTransport ({MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS}) {
    
    const transport = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS
        }
    });    
    
    console.log("se establecio el transport");

    return transport;
}


module.exports = createTransport;
