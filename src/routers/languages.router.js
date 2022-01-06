const express = require('express');
const languageController = require('../controllers/language.controller')

const router = express.Router()

router.get('/', languageController.getLanguage);
router.get('/:id', languageController.getLanguageById);
router.post('/', languageController.setLanguage);
router.delete('/:id', languageController.deleteLanguage);

module.exports = router;