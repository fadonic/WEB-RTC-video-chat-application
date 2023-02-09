"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
const uuid_1 = require("uuid");
const rooms = {};
const chats = {};
const roomHandler = (socket) => {
    const startSharing = ({ peerId, roomId }) => {
        socket.to(roomId).emit('user-start-sharing', peerId);
    };
    const stopSharing = (roomId) => {
        socket.to(roomId).emit('user-stop-sharing');
    };
    const addMessage = (roomId, message) => {
        if (chats[roomId]) {
            chats[roomId].push(message);
        }
        else {
            chats[roomId] = [message];
        }
        socket.to(roomId).emit('add-message', message);
    };
    socket.on('create-room', () => createRoom(socket));
    socket.on('join-room', ({ roomId, peerId }) => joinRoom({ socket, roomId, peerId }));
    socket.on('start-sharing', startSharing);
    socket.on('stop-sharing', stopSharing);
    socket.on('send-message', addMessage);
};
exports.roomHandler = roomHandler;
const createRoom = (socket) => {
    const roomId = (0, uuid_1.v4)();
    rooms[roomId] = [];
    //console.log(`User with ${socket.id} create a room`);
    socket.emit('room-created', { roomId });
};
const joinRoom = ({ socket, roomId, peerId }) => {
    if (rooms[roomId]) {
        socket.join(roomId);
        if (!chats[roomId])
            chats[roomId] = [];
        socket.emit('get-messages', chats[roomId]);
        if (!rooms[roomId].includes(peerId))
            rooms[roomId].push(peerId);
        socket.to(roomId).emit('user-join', { peerId });
        socket.emit('get-users', {
            roomId,
            participants: rooms[roomId],
        });
        socket.on('disconnect', () => {
            leaveRoom({ socket, roomId, peerId });
        });
    }
    else {
        rooms[roomId] = [];
    }
};
const leaveRoom = ({ socket, roomId, peerId }) => {
    rooms[roomId] = rooms[roomId].filter((id) => {
        return id !== roomId;
    });
    socket.to(roomId).emit('user-disconnected', peerId);
};
