const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const rutasProtegidas = express.Router();

rutasProtegidas.use((request, response, next) => {

    const token = request.headers['access-token'];

    if(token) {
        jwt.verify(token, process.env.API_KEY, (error, decoded) => {
            if(error){
                console.log(error)
                response.statusCode = 403;
                return response.json({ success: false, message:  'Token inválida'});
            }else {
                next();
            }
        })
    }
    else {
        response.statusCode = 403;
        response.send({
            success: false,
            message: 'Token no proveída'
        })
    }
});


module.exports = rutasProtegidas;