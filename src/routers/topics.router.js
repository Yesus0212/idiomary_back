const express = require('express');
const topicController = require('../controllers/topic.controller')

const router = express.Router()

router.get('/', topicController.getTopic);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.setTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;