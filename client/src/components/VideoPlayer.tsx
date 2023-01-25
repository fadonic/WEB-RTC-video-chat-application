import React, { useRef, useEffect } from 'react';

const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<video ref={videoRef} autoPlay style={{ width: '250px', padding: '5px' }} />
	);
};

export default VideoPlayer;
