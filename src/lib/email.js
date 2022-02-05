const nodemailer = require('nodemailer');

function createTransport ({SES_HOST, SES_PORT, SES_USER, SES_PASS}) {
    
    const transport = nodemailer.createTransport({
        host: SES_HOST,
        port: SES_PORT,
        auth: {
          user: SES_USER,
          pass: SES_PASS
        }
    });    
    
    console.log("se establecio el transport");

    return transport;
}


module.exports = createTransport;
