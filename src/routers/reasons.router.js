const express = require('express');
const reasonController = require('../controllers/reason.controller')

const router = express.Router()

router.get('/', reasonController.getReason);
router.get('/:id', reasonController.getReasonById);
router.post('/', reasonController.setReason);
router.delete('/:id', reasonController.deleteReason);

module.exports = router;