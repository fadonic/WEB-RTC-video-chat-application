import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { Button, Box } from '@mui/material';

const CreateRoomButton = () => {
	const { ws } = useContext(RoomContext);

	const createRoom = () => {
		ws.emit('create-room');
	};

	return (
		<Box sx={{ textAlign: 'center' }}>
			<Button
				variant="contained"
				sx={{ textTransform: 'capitalize' }}
				onClick={createRoom}
			>
				Start a new meeting
			</Button>
		</Box>
	);
};

export default CreateRoomButton;
