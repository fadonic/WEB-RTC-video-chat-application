import React, { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ShareScreenButton from '../components/ShareScreenButton';
import VideoPlayer from '../components/VideoPlayer';
import { peerState } from '../context/peerReducers';
import { RoomContext } from '../context/RoomContext';
import { Container, Box } from '@mui/material';

const Room: React.FC = () => {
	const { roomId } = useParams();
	const { ws, me, myVideoStream, peers, shareScreen } = useContext(RoomContext);
	const myVideoRef = useRef<HTMLVideoElement>();

	useEffect(() => {
		if (me) ws.emit('join-room', { roomId, peerId: me._id });
		if (myVideoRef.current) {
			myVideoRef.current.srcObject = myVideoStream;
		}
	}, [roomId, me, ws, myVideoStream]);

	return (
		<>
			<Header />
			<Box sx={{ background: '#fff', height: '100vh' }}>
				<div style={{ padding: 10 }}>
					<div style={{ display: 'flex', flexWrap: 'wrap' }}>
						<VideoPlayer stream={myVideoStream} />
						{Object.values(peers as peerState).map((peer) => {
							return <VideoPlayer stream={peer.stream} />;
						})}
					</div>
					<ShareScreenButton shareScreen={shareScreen} />
				</div>
			</Box>
		</>
	);
};

export default Room;
