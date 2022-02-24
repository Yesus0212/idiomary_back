const User = require('../models/user.model');
const Word = require('../models/word.model');
const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');
const mailUser = require('../templates/userRegister');
const Image = require('../controllers/s3saveImage.controller');


require('dotenv').config();

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
  const {userName, email, password, language, country, state, urlImage, userType, points, filters, likes} = request;    
  const setUser = await User.create({
      userName,
      email,
      password,
      language,
      country,
      state,
      urlImage: "https://idiomary.s3.amazonaws.com/avatar_pre/avatar.png",
      userType, 
      points,
      filters, 
      likes
  });

  // Se crea el token para enviarlo de regreso
  const token = jwt.sign(
    { userId: setUser._id, userName, urlImage, userType, filter: false, filters, likes },
    process.env.API_KEY,
    { expiresIn: process.env.TOKEN_EXPIRES},
  );

  if(token){
    const sendMail = await mailUser.registerMail(userName, email);
    console.log(sendMail)
  }

  return {
    userId: setUser._id,
    userName,
    urlImage,
    userType,
    filter: false,
    filters,
    likes,
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
        urlImage: getUser.urlImage,
        filter,
        filters: getUser.filters,
        likes: getUser.likes,
      },
      process.env.API_KEY,
      { expiresIn: process.env.TOKEN_EXPIRES},
    );

    return {
      userId: getUser._id,
      userName: getUser.userName,
      userType: getUser.userType,
      urlImage: getUser.urlImage,
      filter,
      userFilter: getUser.filters,
      likes: getUser.likes,
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

  let newLanguage, newCountry, newState, url, newFilters = undefined;

  const finalFilters = {}; 

  if(language != "") newLanguage = language
  if(country != "") newCountry = country
  if(state != "") newState = state
  if(filters) {
    newFilters = JSON.parse(filters);  

    console.log(typeof(filters), typeof(newFilters))
    
    if((typeof(newFilters?.language) == "string"))
      finalFilters.language = newFilters?.language;
    if((typeof(newFilters?.country) == "string"))
      finalFilters.country = newFilters?.country
    if((typeof(newFilters?.state) == "string"))
      finalFilters.state = newFilters?.state
    if((typeof(newFilters?.topic) == "string"))
      finalFilters.topic = newFilters?.topic

    console.log(typeof(finalFilters))
  }
    
  if(urlImage?.path !== undefined) url = await Image.upload(urlImage);

  const session = await mongoose.startSession();

  try{    
    session.startTransaction();

    const update = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          language: newLanguage,
          country: newCountry,
          state: newState,
          urlImage: url,
          filters: finalFilters
        },
      },
      {     
        new: true,
        useFindAndModify: true,
        returnNewDocument: true,
      }
    );

    await Word.updateMany(
      {
        userId: id,        
      },
      {
        $set: {
          imgUser: url
        }
      }
    );

    await Word.updateMany(
      {
        "complements.userId": id,        
      },
      {
        $set: {
          "complements.imgUser": url
        }
      }
    );

    session.endSession();
    return update;
  }
  catch(error){
    console.log(error);
    // Si ocurre un error, aborta la transacción y deshacer cualquier cambio que pudiera haber ocurrido
    await session.abortTransaction()  
    session.endSession();
    return false;
  } finally {
    // Finaliza la session
    session.endSession()
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
    deleteUser
};