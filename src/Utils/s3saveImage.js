require('dotenv').config();
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');


async function saveImage(file){
    return file;
}

module.exports = {
    saveImage,
}