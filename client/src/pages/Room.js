import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { disconnectSocket, initiateSocket } from 'utils/socket';
import adapter from 'webrtc-adapter';

const peerConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.stunprotocol.org',
    },
  ],
};

const mediaConstraints = {
  audio: true,
  video: true,
};

function openUserMedia() {
  return navigator.mediaDevices.getUserMedia(mediaConstraints);
}

const Room = () => {
  const { roomName } = useParams();
  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localMediaStreamRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const remoteUserRef = useRef();

  useEffect(() => {
    openUserMedia()
      .then((mediaStream) => {
        localMediaStreamRef.current = mediaStream;
        localVideoRef.current.srcObject = mediaStream;

        const socket = initiateSocket(roomName);
        socketRef.current = socket;

        socket.on('RECIPIENT', (remoteUserId) => {
          remoteUserRef.current = remoteUserId;
          callUser();
        });

        socket.on('USER_JOINED', (remoteUserId) => {
          remoteUserRef.current = remoteUserId;
        });

        socket.on('OFFER', handleOfferReceive);

        socket.on('ANSWER', handleAnswerReceive);

        socket.on('NEW_ICE_CANDIDATE', handleNewICECandidate);
      })
      .catch(handleGetUserMediaError);

    return () => {
      disconnectSocket();
    };
  }, [roomName]);

  function handleGetUserMediaError(e) {
    if (e.name === 'NotFoundError') {
      console.error(
        'Unable to open your call because no camera and/or microphone were found'
      );
    } else if (
      e.name === 'SecurityError' ||
      e.name === 'PermissionDeniedError'
    ) {
      console.log('User cancelled the call');
    } else {
      console.error(
        'Error opening your camera and/or microphone: ' + e.message
      );
    }

    closeVideoCall();
  }

  function callUser() {
    if (peerConnectionRef.current) return;

    peerConnectionRef.current = createPeerConnection();

    localMediaStreamRef.current
      .getTracks()
      .forEach((track) =>
        peerConnectionRef.current.addTrack(track, localMediaStreamRef.current)
      );
  }

  function createPeerConnection() {
    const peer = new RTCPeerConnection(peerConfiguration);

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = handleNegotiationNeeded;

    peer.onremovetrack = handleRemoveTrackEvent;
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;

    peerConnectionRef.current = peer;

    return peer;
  }

  async function handleNegotiationNeeded() {
    try {
      const offer = await peerConnectionRef.current.createOffer();

      if (peerConnectionRef.current.signalingState !== 'stable') {
        return;
      }

      await peerConnectionRef.current.setLocalDescription(offer);

      socketRef.current.emit('OFFER', {
        target: remoteUserRef.current,
        sdp: peerConnectionRef.current.localDescription,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleTrackEvent(e) {
    remoteVideoRef.current.srcObject = e.streams[0];
    // TODO: set button disabled prop to false
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      socketRef.current.emit('NEW_ICE_CANDIDATE', {
        target: remoteUserRef.current,
        candidate: e.candidate,
      });
    }
  }

  function handleRemoveTrackEvent() {
    const trackList = remoteVideoRef.current.getTracks();
    if (trackList.length === 0) {
      closeVideoCall();
    }
  }

  function handleICEConnectionStateChangeEvent(e) {
    if (
      peerConnectionRef.current.iceConnectionState === 'closed' ||
      peerConnectionRef.current.iceConnectionState === 'failed'
    ) {
      closeVideoCall();
    }
  }

  async function handleNewICECandidate(payload) {
    const candidate = new RTCIceCandidate(payload);
    await peerConnectionRef.current.addIceCandidate(candidate);
  }

  async function handleAnswerReceive(payload) {
    const desc = new RTCSessionDescription(payload.sdp);
    await peerConnectionRef.current.setRemoteDescription(desc);
  }

  async function handleOfferReceive(payload) {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = createPeerConnection();
    }

    const desc = new RTCSessionDescription(payload.sdp);

    if (peerConnectionRef.current.signalingState !== 'stable') {
      await Promise.all([
        peerConnectionRef.current.setLocalDescription({ type: 'rollback' }),
        peerConnectionRef.current.setRemoteDescription(desc),
      ]);
      return;
    } else {
      await peerConnectionRef.current.setRemoteDescription(desc);
    }

    try {
      localMediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localMediaStreamRef.current)
        );
    } catch (error) {
      handleGetUserMediaError(error);
    }

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.emit('ANSWER', {
      target: remoteUserRef.current,
      sdp: answer,
    });
  }

  function closeVideoCall() {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onnegotiationneeded = null;
      peerConnectionRef.current.onremovetrack = null;
      peerConnectionRef.current.oniceconnectionstatechange = null;

      if (remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      remoteVideoRef.current.removeAttribute('src');
      remoteVideoRef.current.removeAttribute('srcObject');
      localVideoRef.current.removeAttribute('src');
      localVideoRef.current.removeAttribute('srcObject');

      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      localMediaStreamRef.current = null;
    }
  }

  function handleHangUpCall() {
    closeVideoCall();
    socketRef.current.emit('HANG_UP', {
      target: remoteUserRef.current,
    });
  }

  return (
    <div className="sm:mt-40">
      <h2>Meeting</h2>
      <video ref={remoteVideoRef} autoPlay />
      <video ref={localVideoRef} muted autoPlay />

      <button onClick={handleHangUpCall} disabled={!peerConnectionRef.current}>
        Hang Up
      </button>
    </div>
  );
};

export default Room;
