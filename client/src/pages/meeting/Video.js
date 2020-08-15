import React, { useEffect, useRef } from 'react';

function Video({ peer }) {
  const videoRef = useRef(null);

  useEffect(() => {
    peer.ontrack = (e) => {
      videoRef.current.srcObject = e.streams[0];
    };
  }, []);

  return (
    <video ref={videoRef} autoPlay playsInline className="w-full max-w-full" />
  );
}

export default Video;
