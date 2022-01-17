const express = require('express');
const wordController = require('../controllers/word.controller')

const router = express.Router()

// router.get('/', wordController.getWord);
router.get('/:id', wordController.getWordById);
router.post('/', wordController.setWord);
router.delete('/:id', wordController.deleteWord);
router.patch('/newItem/:id', wordController.setNewItemWord);
router.patch('/updateStatus/:id', wordController.updateStatusWord);
router.get('/', wordController.getFilters);

module.exports = router;