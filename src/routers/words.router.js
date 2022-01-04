const express = require('express');
const wordController = require('../controllers/word.controller')

const router = express.Router()

router.get('/', wordController.getWord);
router.get('/:id', wordController.getWordById);
router.post('/', wordController.setWord);
router.delete('/:id', wordController.deleteWord);

module.exports = router;