import React from 'react';

const ShareScreenButton = ({ shareScreen }: { shareScreen: () => void }) => {
	return (
		<div style={{ padding: 10 }}>
			<button onClick={shareScreen}>Share screen</button>
		</div>
	);
};

export default ShareScreenButton;
