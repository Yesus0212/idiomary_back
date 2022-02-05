const express = require('express');
const userController = require('../controllers/user.controller')
const routeProtected = require('../middlewares/routeProtected')

const router = express.Router()

router.get('/', userController.getUser);
router.get('/:id', routeProtected, userController.getUserById);
router.post('/signup', userController.setUser);
router.post('/login', userController.getLogin);
router.delete('/:id', routeProtected, userController.deleteUser);
router.patch('/:id', routeProtected, userController.updateUser);

module.exports = router;