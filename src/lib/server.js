const express = require('express');
const cors = require('cors');

const word = require('../routers/words.router');
const user = require('../routers/users.router');
const topic = require('../routers/topics.router');

const logger = require('../middlewares/logger')

const server = express();

server.use(express.json());

server.use(cors());
server.options('*', cors());

server.use(logger);

server.use('/words', word);
server.use('/users', user);
server.use('/topics', topic);


module.exports = server;