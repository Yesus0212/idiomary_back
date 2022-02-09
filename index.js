require('dotenv').config();

const dbConnect = require('./src/lib/db');
const server = require('./src/lib/server');

const http = require("http");
const socketIo = require("socket.io");

dbConnect(process.env)
    .then(() => {
        console.log('DB Connected!');

        server.listen(process.env.PORT, () => {
            console.log('Server is running');
        });

        const socketServer = http.createServer(server);
        const io = socketIo(socketServer);
        const getApiAndEmit = "TODO";

    })
    .catch((error) => {
        console.error(error);
    })