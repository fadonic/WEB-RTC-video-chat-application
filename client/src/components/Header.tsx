import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material/';

const Header = () => {
	return (
		<AppBar position="static">
			<Toolbar variant="dense">
				<Typography variant="h6" color="inherit" component="div">
					WEBRTC video chat
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
