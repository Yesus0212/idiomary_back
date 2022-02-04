const express = require('express');
const userController = require('../controllers/user.controller')

const router = express.Router()

router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/signup', userController.setUser);
router.post('/login', userController.getLogin);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);

module.exports = router;