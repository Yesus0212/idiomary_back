const express = require('express');
const userTypeController = require('../controllers/userType.controller')

const router = express.Router()

router.get('/', userTypeController.getUserType);
router.get('/:id', userTypeController.getUserTypeById);
router.post('/', userTypeController.setUserType);
router.delete('/:id', userTypeController.deleteUserType);

module.exports = router;