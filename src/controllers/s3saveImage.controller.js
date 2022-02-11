require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid"); // Librería para generar identificadores unicos

async function upload(request, response){

    // Creamos la constante de S3, con toda la información para la conexión
    const S3 = new AWS.S3({
        signatureVersion: "v4",
        apiVersion: "2006-03-01",
        accessKeyId: process.env.S3_USER,
        secretAccessKey: process.env.S3_PASS,
        region: process.env.REGION,
    });
    
    const form = formidable({ multiples: true });

    form.parse(request, (err, fields, files) => {   

        if (err) {      
            next(err);      
            return;    
        }

        const id = uuidv4();
        
        S3.putObject(
            {
                Bucket: process.env.S3_BUCKET,
                Key: id,
                ContentType: files.file.type,
                ContentLength: files.file.size,
                Body: fs.createReadStream(files.file.path),
            }
        );

    });
}

module.exports = {
    upload,
}