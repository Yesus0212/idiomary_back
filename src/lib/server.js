const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const word = require('../routers/words.router');
const user = require('../routers/users.router');
const topic = require('../routers/topics.router');
const reason = require('../routers/reasons.router');
const userType = require('../routers/userTypes.router');
const language = require('../routers/languages.router');
const token = require('../routers/tokens.router');
const image = require('../routers/saveImages.router');

const logger = require('../middlewares/logger')

const server = express();

server.use(express.json());

server.use(cors());
server.options('*', cors());

server.use(logger);

// Revisar, porque esto no sirve de nada
// server.use(express.urlencoded({ limit: "1kb" }));
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/words', word);
server.use('/users', user);
server.use('/topics', topic);
server.use('/reasons', reason);
server.use('/userTypes', userType);
server.use('/languages', language);
server.use('/validateToken', token);
server.use('/image', image);


module.exports = server;