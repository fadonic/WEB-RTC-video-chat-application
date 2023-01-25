import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface IRoomParam {
	socket: Socket;
	roomId: string;
	peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
	socket.on('create-room', () => createRoom(socket));
	socket.on('join-room', ({ roomId, peerId }) =>
		joinRoom({ socket, roomId, peerId })
	);
};

const createRoom = (socket: Socket) => {
	const roomId = uuidv4();
	rooms[roomId] = [];
	//console.log(`User with ${socket.id} create a room`);
	socket.emit('room-created', { roomId });
};

const joinRoom = ({ socket, roomId, peerId }: IRoomParam) => {
	if (rooms[roomId]) {
		socket.join(roomId);
		if (!rooms[roomId].includes(peerId)) rooms[roomId].push(peerId);
		socket.to(roomId).emit('user-join', { peerId });
		socket.emit('get-users', {
			roomId,
			participants: rooms[roomId],
		});

		socket.on('disconnect', () => {
			leaveRoom({ socket, roomId, peerId });
		});
	}

	//console.log(`User joined room with room Id ${roomId} ${rooms[roomId]}`);
};

const leaveRoom = ({ socket, roomId, peerId }: IRoomParam) => {
	rooms[roomId] = rooms[roomId].filter((id) => {
		return id !== roomId;
	});
	socket.to(roomId).emit('user-disconnected', peerId);
};
