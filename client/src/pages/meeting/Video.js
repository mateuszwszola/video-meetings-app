import React, { useEffect, useRef } from 'react';

/*function Video({ srcObject, ...props }) {
  const refVideo = useRef(null);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  return <video ref={refVideo} {...props} />;
}*/

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
