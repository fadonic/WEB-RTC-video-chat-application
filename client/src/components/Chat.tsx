import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { IMessage } from '../types/chat';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const Chat: React.FC = () => {
	const { chat } = useContext(RoomContext);
	console.log('inside chat', chat);
	return (
		<Box
			sx={{
				height: '100%',
				flex: 1,
				border: 'solid 1px #ddd',
				padding: '1rem',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<Box>
				{chat?.messages?.map((message: IMessage, idx: number) => {
					return <ChatBubble message={message} key={idx} />;
				})}
			</Box>
			<ChatInput />
		</Box>
	);
};

export default Chat;
