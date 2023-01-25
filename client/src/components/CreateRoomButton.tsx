import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

const CreateRoomButton = () => {
	const { ws } = useContext(RoomContext);

	const createRoom = () => {
		ws.emit('create-room');
	};

	return <button onClick={createRoom}>Start a new meeting</button>;
};

export default CreateRoomButton;
