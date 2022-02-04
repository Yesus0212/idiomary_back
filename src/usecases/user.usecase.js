const res = require('express/lib/response');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
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
      { userId: setUser._id, userName, userType },
      process.env.API_KEY,
      { expiresIn: process.env.TOKEN_EXPIRES},
    );

    return token;
}


// Función para validar el acceso de un usuario
async function getLogin(request) {
  const {userName, password} = request;

  const getUser = await User.findOne({userName});

  if(getUser) {

    const valida = (password === getUser.password);
    if(valida){
      const token = jwt.sign(
        { userId: getUser._id, userName: getUser.userName, userType: getUser.userType },
        process.env.API_KEY,
        { expiresIn: process.env.TOKEN_EXPIRES},
      );

      console.log(token)

      return token;
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