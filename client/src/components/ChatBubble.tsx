import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { IMessage } from '../types/chat';

const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
	const { me } = useContext(RoomContext);

	return (
		<div
			style={{
				padding: '10px',
				border: '1px solid #ddd',
				marginBottom: '10px',
				background: '#ededed',
				width: '50%',
				color: me._id === message.author ? 'red' : 'green',
				float: me._id === message.author ? 'left' : 'right',
			}}
		>
			{message.content}
		</div>
	);
};

export default ChatBubble;
