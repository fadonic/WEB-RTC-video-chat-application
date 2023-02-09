import React, { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ShareScreenButton from '../components/ShareScreenButton';
import VideoPlayer from '../components/VideoPlayer';

import { RoomContext } from '../context/RoomContext';
import { Box } from '@mui/material';
import Chat from '../components/Chat';
import { peerState } from '../reducers/peerReducers';

const Room: React.FC = () => {
	const { roomId } = useParams();
	const { ws, me, myVideoStream, peers, shareScreen, setRoomId } =
		useContext(RoomContext);

	const myVideoRef = useRef<HTMLVideoElement>();

	useEffect(() => {
		if (me) ws.emit('join-room', { roomId, peerId: me._id });
		if (myVideoRef.current) {
			myVideoRef.current.srcObject = myVideoStream;
		}
	}, [roomId, me, ws, myVideoStream]);

	useEffect(() => {
		setRoomId(roomId);
	}, [roomId, setRoomId]);

	console.log('pp', Object.values(peers as peerState));
	const fst = Object.values(peers as peerState);
	console.log(fst);

	return (
		<>
			<Header />
			<Box sx={{ background: '#fff', height: '100vh', display: 'flex' }}>
				<Box sx={{ flex: 4 }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
						<VideoPlayer stream={myVideoStream} vWidth={150} />
						{Object.values(peers as peerState).map((peer, idx) => {
							return (
								<VideoPlayer stream={peer.stream} vWidth={150} key={idx} />
							);
						})}
					</Box>
					<Box
						sx={{
							height: '100%',
							backgroundColor: '#ededed',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'flex-start',
						}}
					>
						<Box sx={{ marginTop: '50px' }}>
							<ShareScreenButton shareScreen={shareScreen} />
							<VideoPlayer stream={myVideoStream} vWidth={500} />
						</Box>
					</Box>
				</Box>
				<Chat />
			</Box>
		</>
	);
};

export default Room;
