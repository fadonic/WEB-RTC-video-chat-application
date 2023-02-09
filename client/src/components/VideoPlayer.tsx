import React, { useRef, useEffect } from 'react';

const VideoPlayer: React.FC<{ stream: MediaStream; vWidth: number }> = ({
	stream,
	vWidth,
}) => {
	const videoRef = useRef<HTMLVideoElement | any>();

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<video ref={videoRef} autoPlay style={{ width: vWidth, padding: '5px' }} />
	);
};

export default VideoPlayer;
