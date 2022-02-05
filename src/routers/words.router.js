const express = require('express');
const wordController = require('../controllers/word.controller')
const routeProtected = require('../middlewares/routeProtected')

const router = express.Router()

router.get('/', wordController.getWord);
router.get('/filters', wordController.getWordsByFilter)
router.get('/:id', wordController.getWordById);
router.post('/', routeProtected, wordController.setWord);
router.delete('/:id', routeProtected, wordController.deleteWord);
router.patch('/newItem/:id', routeProtected, wordController.setNewItemWord);
router.patch('/updateStatus/:id', routeProtected, wordController.updateStatusWord);

module.exports = router;