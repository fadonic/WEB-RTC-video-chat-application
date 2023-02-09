import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface IRoomParam {
	socket: Socket;
	roomId: string;
	peerId: string;
}

interface IMessage {
	content: string;
	author?: string;
	timestamp: number;
}

const rooms: Record<string, string[]> = {};
const chats: Record<string, IMessage[]> = {};

export const roomHandler = (socket: Socket) => {
	const startSharing = ({ peerId, roomId }: IRoomParam) => {
		socket.to(roomId).emit('user-start-sharing', peerId);
	};

	const stopSharing = (roomId: string) => {
		socket.to(roomId).emit('user-stop-sharing');
	};

	const addMessage = (roomId: string, message: IMessage) => {
		if (chats[roomId]) {
			chats[roomId].push(message);
		} else {
			chats[roomId] = [message];
		}
		socket.to(roomId).emit('add-message', message);
	};

	socket.on('create-room', () => createRoom(socket));
	socket.on('join-room', ({ roomId, peerId }) =>
		joinRoom({ socket, roomId, peerId })
	);
	socket.on('start-sharing', startSharing);
	socket.on('stop-sharing', stopSharing);
	socket.on('send-message', addMessage);
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
		if (!chats[roomId]) chats[roomId] = [];
		socket.emit('get-messages', chats[roomId]);
		if (!rooms[roomId].includes(peerId)) rooms[roomId].push(peerId);
		socket.to(roomId).emit('user-join', { peerId });
		socket.emit('get-users', {
			roomId,
			participants: rooms[roomId],
		});

		socket.on('disconnect', () => {
			leaveRoom({ socket, roomId, peerId });
		});
	} else {
		rooms[roomId] = [];
	}
};

const leaveRoom = ({ socket, roomId, peerId }: IRoomParam) => {
	rooms[roomId] = rooms[roomId].filter((id) => {
		return id !== roomId;
	});
	socket.to(roomId).emit('user-disconnected', peerId);
};
