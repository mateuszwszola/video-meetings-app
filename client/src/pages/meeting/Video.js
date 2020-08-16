import React, { useEffect, useRef } from 'react';

function Video({ peer, closeConnection }) {
  const videoRef = useRef(null);

  useEffect(() => {
    peer.ontrack = handleTrackEvent;
    peer.onremovetrack = handleRemoveTrackEvent;
  }, []);

  function handleTrackEvent(e) {
    videoRef.current.srcObject = e.streams[0];
  }

  function handleRemoveTrackEvent(e) {
    const mediaTracks =
      videoRef.current &&
      videoRef.current.srcObject &&
      videoRef.current.srcObject.getTracks();
    if (mediaTracks && mediaTracks.length === 0) {
      closeConnection();
    }
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full max-w-screen-sm"
    />
  );
}

export default Video;
