const express = require('express');
const wordController = require('../controllers/user.controller')

const router = express.Router()

router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.setUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;