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
    return setUser;
}

// Actualiza el numero de palabras de un usuario
async function updateNumber(idUser, statusWord) {

  let updateNumber;
 
  switch (statusWord) {
    case 1:
      updateNumber = await User.findOneAndUpdate(
        {
          _id: idUser,
        },
        {
          $inc:{
            inValidation: 1
          }
        }            
      );
      break;
    case 2:
      updateNumber = await User.findOneAndUpdate(
        {
          _id: idUser,
        },
        {
          $inc: {
            inValidation: -1,
            validated: 1
          }
        }
      );            
      break;
    case 3:
      updateNumber = await User.findOneAndUpdate(
        {
          _id: idUser,
        },
        {
          $inc: {
            inValidation: -1,
            canceled: 1
          }
        }
      );         
      break;
    default:
      updateNumber = "Invalid Action";
      break;
  }
  return updateNumber;
};


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


// Función para validar
async function getAuthenticate(userName, password) {
  
  const key = process.env.KEY;

  jwt.sign(userName, key, (err, token) => {
    if(err){
      return err;
    }
    else {
      return {
        msg: 'success',
        token: token
      }
    }
  })
}


module.exports = {    
    getUsers,
    getUsersById,
    setUser,
    updateNumber,
    setNewData,
    deleteUser,
    getAuthenticate
};