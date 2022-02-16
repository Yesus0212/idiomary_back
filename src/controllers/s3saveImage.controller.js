require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid"); // Librería para generar identificadores unicos

async function upload(id, request){

    const data = {}

    data.id = id;

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
            
            if(!(Object.keys(files).length === 0) && (Object.keys(files).includes("urlImage"))){
                
                if (err) {                      
                    console.log(err)
                    return null;
                }
        
                const id = uuidv4();
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: id,
                    ACL: 'public-read',
                    Body: fs.createReadStream(files.urlImage.filepath),
                    ContentType: files.urlImage.mimetype,
                    ContentLength: files.urlImage.size,
                }
          
                S3.upload(uploadParams, (err, data) => {
                    if(err) {
                        console.log(err)
                        return null;
                    }
                    if(data) {
                        data.urlImage = data.Location;
                    }
                });            

            }   
            
            if(!(Object.keys(files).length === 0) && (Object.keys(files).includes("filters"))){
                data.filters = files.filters;
            }
            
            if(!(Object.keys(fields).length === 0)){
                if(Object.keys(fields).includes("language")) data.language = fields.language;
                if(Object.keys(fields).includes("country")) data.country = fields.country;
                if(Object.keys(fields).includes("state")) data.state = fields.state;
            }

            return data;
    
        });
        
    } catch (error) {
        console.log(error)
        return null; 
    }
    
}

module.exports = {
    upload,
}