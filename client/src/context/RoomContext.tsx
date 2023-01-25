import { createContext, useEffect, useReducer, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { peerAction, peerReducer, peerState } from './peerReducers';
import { addPeerAction, removePeerAction } from './peerActions';

export const RoomContext = createContext<any>(null);
const ws = socketIOClient('http://localhost:3001');

export const RoomContextPovider: React.FC<{ children: any; data: any }> = ({
	children,
	data,
}) => {
	const navigate = useNavigate();
	const [me, setMe] = useState<Peer>();
	const [myVideoStream, setMyVideoStream] = useState<MediaStream>();
	const [isSharedScreen, setIsSharedScreen] = useState<boolean>(false);

	const [peers, dispatch] = useReducer<
		(state: peerState, action: peerAction) => any
	>(peerReducer, {});

	const enterRoom = ({ roomId }: { roomId: string }) => {
		navigate(`/room/${roomId}`);
	};

	const getUsers = ({ participants }: { participants: string[] }) => {
		console.log('participants: ', participants);
	};

	const leaveRoom = (peerId: string): void => {
		dispatch(removePeerAction(peerId));
	};

	const shareScreen = () => {
		if (!isSharedScreen) {
			setIsSharedScreen(true);
			navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
				setMyVideoStream(stream);
			});
		} else {
			setIsSharedScreen(false);
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
				setMyVideoStream(stream);
			});
		}
	};

	useEffect(() => {
		const meId = uuidv4();
		const peer = new Peer(meId);
		setMe(peer);

		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			setMyVideoStream(stream);
		});

		ws.on('room-created', enterRoom);
		ws.on('get-users', getUsers);
		ws.on('user-disconnected', leaveRoom);
	}, []);

	useEffect(() => {
		if (!me || !myVideoStream) return;
		//if (!myVideoStream) return;
		//console.log('here', myVideoStream);

		ws.on('user-join', ({ peerId }) => {
			console.log('listeing');
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
		<RoomContext.Provider value={{ ws, me, myVideoStream, peers, shareScreen }}>
			{children}
		</RoomContext.Provider>
	);
};
