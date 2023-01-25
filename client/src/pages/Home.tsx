import React from 'react';
import { Box, Typography } from '@mui/material';
import CreateRoomButton from '../components/CreateRoomButton';
import Header from '../components/Header';

const Home: React.FC = () => {
	return (
		<Box>
			<Header />
			<Box sx={{ width: '400px', margin: '50px auto', marginTop: '70px' }}>
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 'bold', marginBottom: '20px' }}
				>
					Welcome to WEBRTC Video Meetings!
				</Typography>
				<Typography align="center">
					Start a new meetings with a single click all in one place. You are
					currently having unlimited minutes per meeting. Upgrade now if you need
					more time.
				</Typography>
			</Box>
			<CreateRoomButton />
		</Box>
	);
};

export default Home;
