const express = require('express');
const req = require('express/lib/request');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const rutasProtegidas = express.Router();

rutasProtegidas.use((request, response, next) => {

    const token = request.headers['access-token'];

    if(token) {
        jwt.verify(token, process.env.API_KEY, (error, decoded) => {
            if(error){
                return response.json({ success: false, message:  'Token inválida'});
            }else {
                request.decoded = decoded;
                next();
            }
        })
    }
    else {
        response.send({
            success: false,
            message: 'Token no proveída'
        })
    }
});


module.exports = rutasProtegidas;