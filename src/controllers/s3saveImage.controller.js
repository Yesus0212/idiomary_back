require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid"); // Librería para generar identificadores unicos

async function upload(request){

    const urlImage = request;

    try {
       
        // Creamos la constante de S3, con toda la información para la conexión
        const S3 = new AWS.S3({
            signatureVersion: "v4",
            apiVersion: "2006-03-01",
            accessKeyId: process.env.S3_USER,
            secretAccessKey: process.env.S3_PASS,
            region: process.env.REGION,
        });
    
        if(!(Object.keys(urlImage).length === 0)){
            
            const id = uuidv4();
            const uploadParams = {
                Bucket: process.env.S3_BUCKET,
                Key: id,
                ACL: 'public-read',
                Body: fs.createReadStream(urlImage.path),
                ContentType: urlImage.type,
                ContentLength: urlImage.size,
            }
      
            try{
                const url = await S3.upload(uploadParams).promise();
                return url.Location;
            }
            catch(error) {
                console.log(error)
            }

        }else{                
            return undefined; 
        }        
        
    } catch (error) {
        console.log(error)
        return undefined; 
    }
    
}

module.exports = {
    upload,
}