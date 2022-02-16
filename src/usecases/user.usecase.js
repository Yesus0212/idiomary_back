const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mailUser = require('../templates/userRegister');
require('dotenv').config();

// Para el manejo de la los datos para la actualización en el perfil
const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require("formidable"); // Librería para el manejo de las imagenes
const { v4: uuidv4 } = require("uuid");


// Función de consulta de todos los Users y filtrado
async function getUsers(filters) {
    const users = await User.find(filters);
    return users;
}


// Función de consulta por ID
async function getUsersById(request) {
    const id = request;
    const user = await User.findById(id);
    return user;
}


// Función de inserción de user nuevo
async function setUser(request) {
  const {userName, email, password, language, country, state, urlImage, userType, points, filters} = request;    
  const setUser = await User.create({
      userName,
      email,
      password,
      language,
      country,
      state,
      urlImage,
      userType, 
      points,
      filters
  });

  // Se crea el token para enviarlo de regreso
  const token = jwt.sign(
    { userId: setUser._id, userName, userType, filter: false, filters },
    process.env.API_KEY,
    { expiresIn: process.env.TOKEN_EXPIRES},
  );

  return {
    userId: setUser._id,
    userName,
    userType,
    filter: false,
    filters,
    token
  };
}


// Función para validar el acceso de un usuario
async function getLogin(request) {
const {email, password} = request;

const getUser = await User.findOne({email});

if(getUser) {
  const valida = (password === getUser.password);
  if(valida){

    let filter = false;

    if(getUser.filters)   filter = true;

    const token = jwt.sign(
      { 
        userId: getUser._id, 
        userName: getUser.userName, 
        userType: getUser.userType,
        filter,
        filters: getUser.filters
      },
      process.env.API_KEY,
      { expiresIn: process.env.TOKEN_EXPIRES},
    );

    return {
      userId: getUser._id,
      userName: getUser.userName,
      userType: getUser.userType,
      filter,
      userFilter: getUser.filters,
      token
    }
  }
}
else {
  return {
    error: 401
  }
}
}


// Función para actualizar la información de un usuario 
async function setNewData(request) {

  const {id, language, country, state, urlImage, filters} = request;   

  const updateUser = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        language,
        country,
        state,
        urlImage,
        filters
      },
    },
    {     
      new: true,
      useFindAndModify: true,
      returnNewDocument: true,
    }
  );  
  
  return updateUser;   
}


async function getNewImage(request) {

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
                    return data.Location;
                }
            });            

        }   
    });
    
} catch (error) {
    console.log(error)
    return null; 
}


}
  

// Función de eliminación de user por ID
async function deleteUser(request) {
  const id = request;         
  const deleteUser = await User.findByIdAndDelete(id);
  return deleteUser;
}


module.exports = {    
    getUsers,
    getUsersById,
    setUser,
    getLogin,
    setNewData,
    getNewImage,
    deleteUser
};