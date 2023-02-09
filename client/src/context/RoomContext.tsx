import { createContext, useEffect, useReducer, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { peerAction, peerReducer, peerState } from '../reducers/peerReducers';
import { addPeerAction, removePeerAction } from '../reducers/peerActions';
import { IMessage } from '../types/chat';
import { chatAction, chatReducer, chatState } from '../reducers/chatReducers';
import { addHistoryAction, addMessageAction } from '../reducers/chatActions';

export const RoomContext = createContext<any>(null);
const ws = socketIOClient('http://localhost:3001');

export const RoomContextPovider: React.FC<{ children: any; data: any }> = ({
	children,
	data,
}) => {
	const navigate = useNavigate();
	const [me, setMe] = useState<Peer>();
	const [myVideoStream, setMyVideoStream] = useState<MediaStream>();
	const [screenSharingId, setScreenSharingId] = useState<string>('');
	const [roomId, setRoomId] = useState<string>('');

	const [peers, dispatch] = useReducer<
		(state: peerState, action: peerAction) => any
	>(peerReducer, {});

	const state: { messages: IMessage[] } = { messages: [] };

	const [chat, chatDispatch] = useReducer<
		(state: chatState, action: chatAction) => { messages: IMessage[] }
	>(chatReducer, state);

	const enterRoom = ({ roomId }: { roomId: string }) => {
		navigate(`/room/${roomId}`);
	};

	const getUsers = ({ participants }: { participants: string[] }) => {
		//console.log('participants: ', participants);
	};

	const leaveRoom = (peerId: string): void => {
		dispatch(removePeerAction(peerId));
	};

	const switchStream = (stream: MediaStream) => {
		setMyVideoStream(stream);
		setScreenSharingId(me?.id || '');

		Object.values(peers).forEach((connection: any) => {
			const videoTract = myVideoStream?.getVideoTracks();
			connection[0].peerConnection
				.getSenders()[1]
				.replaceTrack(videoTract)
				.catch((err: any) => {
					console.log(err);
				});
		});
	};

	const shareScreen = () => {
		if (screenSharingId) {
			navigator.mediaDevices.getUserMedia({ video: true }).then(switchStream);
		} else {
			navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
		}
	};

	const sendMessage = (message: string) => {
		const messageData: IMessage = {
			content: message,
			author: me?.id,
			timestamp: new Date().getTime(),
		};
		chatDispatch(addMessageAction(messageData));
		ws.emit('send-message', roomId, messageData);
	};

	const addMessage = (message: IMessage) => {
		chatDispatch(addMessageAction(message));
	};

	useEffect(() => {
		const meId = uuidv4();
		const peer = new Peer(meId);
		// const peer = new Peer(meId, {
		// 	host: 'localhost',
		// 	port: 9000,
		// 	path: '/',
		// });
		setMe(peer);

		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			setMyVideoStream(stream);
		});

		ws.on('room-created', enterRoom);
		ws.on('get-users', getUsers);
		ws.on('user-disconnected', leaveRoom);
		ws.on('user-start-sharing', (peerId) => setScreenSharingId(peerId));
		ws.on('user-stop-sharing', () => setScreenSharingId(''));
		ws.on('add-message', addMessage);
		ws.on('get-messages', (messages) => {
			console.log('messages', messages);
			chatDispatch(addHistoryAction(messages));
		});

		return () => {
			ws.off('room-created');
			ws.off('get-users');
			ws.off('user-disconnected');
			ws.off('user-start-sharing');
			ws.off('user-stop-sharing');
			ws.off('add-message');
			ws.off('get-messages');
		};
	}, []);

	useEffect(() => {
		if (screenSharingId) {
			ws.emit('start-sharing', { peerId: screenSharingId, roomId: roomId });
		} else {
			ws.emit('stop-sharing', roomId);
		}
	}, [roomId, screenSharingId]);

	useEffect(() => {
		if (!me || !myVideoStream) return;
		//if (!myVideoStream) return;
		//console.log('here', myVideoStream);

		ws.on('user-join', ({ peerId }) => {
			const call = me.call(peerId, myVideoStream);
			call.on('stream', (remoteStream) => {
				dispatch(addPeerAction(peerId, remoteStream));
				// display video stream for the join user
			});
		});

		me.on(
			'call',
			(call) => {
				call.answer(myVideoStream);
				call.on('stream', (remoteStream) => {
					// Show stream in some video/canvas element.
					dispatch(addPeerAction(call.peer, remoteStream));
				});
			},
			function (err: Error) {
				console.log('Failed to get local stream', err);
			}
		);
	}, [me, myVideoStream]);

	return (
		<RoomContext.Provider
			value={{
				ws,
				me,
				myVideoStream,
				peers,
				shareScreen,
				chat,
				screenSharingId,
				sendMessage,
				setRoomId,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
};
