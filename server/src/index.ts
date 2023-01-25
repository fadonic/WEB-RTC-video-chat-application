import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { roomHandler } from './room';

const app = express();
const port = 3001;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (socket) => {
	console.log(`User has connected with socket Id ${socket.id}`);
	roomHandler(socket);
});

httpServer.listen(port, () => {
	console.log(`Server started and running on port ${port}`);
});
