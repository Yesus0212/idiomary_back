require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid"); // Librería para generar identificadores unicos

async function upload(request, response){

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

            console.log(Object.keys(files).length === 0)
            
            if(!(Object.keys(files).length === 0)){
                
                if (err) {                      
                    response.statusCode = 404;
                    response.json({
                        success: false,
                        err
                    })
                }
        
                const id = uuidv4();
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: id,
                    Body: fs.createReadStream(files.image.filepath)
                }
          
                S3.upload(uploadParams, (err, data) => {
                    if(err) {
                        // response.statusCode
                        response.json({
                            success: false,
                            err
                        });
                    }
                    if(data) {
                        response.statusCode = 200;
                        response.json({
                            success: true,
                            urlImage: data.Location,
                        });
                    }
                });            

            }else{
                response.statusCode = 400;
                response.json({
                    success: false,
                    message: "Missing file"
                })

            }

    
        });
        
    } catch (error) {

        response.statusCode = 500;
        response.json({
            success: false,
            error
        })
        
    }

    
}

module.exports = {
    upload,
}