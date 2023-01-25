"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const room_1 = require("./room");
const app = (0, express_1.default)();
const port = 3001;
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
io.on('connection', (socket) => {
    console.log(`User has connected with socket Id ${socket.id}`);
    (0, room_1.roomHandler)(socket);
});
httpServer.listen(port, () => {
    console.log(`Server started and running on port ${port}`);
});
