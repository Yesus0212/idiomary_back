require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid"); // Librería para generar identificadores unicos

async function upload(request){

    try {
        
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

            // Los fields, contienen todo lo que no sea una imagen
            
            if(!(Object.keys(files).length === 0) && (Object.keys(files) == "files")){
                
                if (err) {                      
                    console.log(err)
                    return null;                    
                }
        
                const id = uuidv4();
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: id,
                    ACL: 'public-read',
                    Body: fs.createReadStream(files.files.filepath),
                    ContentType: files.files.mimetype,
                    ContentLength: files.files.size,
                }

                response.json({success: true})
          
                S3.upload(uploadParams, (err, data) => {
                    if(err) {
                        console.log(err)
                        return null; 
                    }
                    if(data) {
                        return data.Location
                    }
                });            

            }else{                
                return null; 
            }

    
        });
        
    } catch (error) {
        console.log(error)
        return null; 
    }
    
}

module.exports = {
    upload,
}