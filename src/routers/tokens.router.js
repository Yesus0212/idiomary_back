const express = require('express');
const tokenController = require('../controllers/token.controller')
const routeProtected = require('../middlewares/routeProtected')

const router = express.Router()

router.get('/', routeProtected, tokenController.validateToken);

module.exports = router;