import React from 'react';
import '../App.css';
import CreateRoomButton from '../components/CreateRoomButton';

const Home: React.FC = () => {
	return (
		<div className="App">
			<h1>WEBRTC video chat</h1>
			<CreateRoomButton />
		</div>
	);
};

export default Home;
