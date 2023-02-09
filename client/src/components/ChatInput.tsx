import { Box } from '@mui/material';
import React, { useContext, useState } from 'react';
import { RoomContext } from '../context/RoomContext';

const ChatInput = () => {
	const [message, setMessage] = useState('');
	const { sendMessage } = useContext(RoomContext);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				sendMessage(message);
				setMessage('');
			}}
		>
			<Box>
				<textarea
					style={{ width: '100%', height: '200px' }}
					onChange={(e) => setMessage(e.target.value)}
					value={message}
				>
					Input
				</textarea>
				<button type="submit">Send</button>
			</Box>
		</form>
	);
};

export default ChatInput;
