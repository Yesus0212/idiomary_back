const express = require('express');
const saveImageController = require('../controllers/s3saveImage.controller')
const routeProtected = require('../middlewares/routeProtected')

const router = express.Router()

router.post('/upload', saveImageController.upload);

module.exports = router;