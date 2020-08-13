import React, { useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { initiateSocket, disconnectSocket } from 'utils/socket';
import { openUserMedia } from 'utils/webrtc';
import { peerConfiguration } from 'config';

function Meeting() {
  const { roomName } = useParams();
  const history = useHistory();
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

        socket.on('RECIPIENT', (remoteUserId) => {
          remoteUserRef.current = remoteUserId;
          callUser();
        });

        socket.on('USER_JOINED', (remoteUserId) => {
          remoteUserRef.current = remoteUserId;
        });

        socket.on('USER_DISCONNECTED', (userId) => {
          handleCloseConnection(userId);
        });

        socket.on('OFFER', handleOfferReceive);

        socket.on('ANSWER', handleAnswerReceive);

        socket.on('NEW_ICE_CANDIDATE', handleNewICECandidate);

        socketRef.current = socket;
      })
      .catch(handleGetUserMediaError);

    return () => {
      handleCloseVideoCall();
      disconnectSocket();
    };
  }, [roomName]);

  function callUser() {
    if (peerConnectionRef.current) return;

    peerConnectionRef.current = createPeerConnection();

    try {
      localMediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localMediaStreamRef.current)
        );
    } catch (err) {
      handleGetUserMediaError(err);
    }
  }

  function createPeerConnection() {
    const peer = new RTCPeerConnection(peerConfiguration);

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = handleNegotiationNeededEvent;

    peer.onremovetrack = handleRemoveTrackEvent;
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;

    return peer;
  }

  async function handleNegotiationNeededEvent() {
    if (!peerConnectionRef.current) return;

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
      handleCloseConnection(remoteUserRef.current);
    }
  }

  function handleICEConnectionStateChangeEvent() {
    const currentState = peerConnectionRef.current.iceConnectionState;
    if (
      currentState === 'closed' ||
      currentState === 'failed' ||
      currentState === 'disconnected'
    ) {
      handleCloseConnection(remoteUserRef.current);
    }
  }

  async function handleNewICECandidate(payload) {
    const candidate = new RTCIceCandidate(payload);
    await peerConnectionRef.current
      .addIceCandidate(candidate)
      .catch(console.error);
  }

  async function handleAnswerReceive(payload) {
    const desc = new RTCSessionDescription(payload.sdp);
    await peerConnectionRef.current
      .setRemoteDescription(desc)
      .catch(console.error);
  }

  async function handleOfferReceive(payload) {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = createPeerConnection();
    }

    const desc = new RTCSessionDescription(payload.sdp);

    await peerConnectionRef.current.setRemoteDescription(desc);

    try {
      localMediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localMediaStreamRef.current)
        );
    } catch (err) {
      handleGetUserMediaError(err);
    }

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.emit('ANSWER', {
      target: remoteUserRef.current,
      sdp: answer,
    });
  }

  function handleCloseVideoCall() {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.pause();
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    localMediaStreamRef.current = null;
  }

  function handleCloseConnection(remoteUserId) {
    if (remoteUserRef.current !== remoteUserId || !peerConnectionRef.current)
      return;

    peerConnectionRef.current.ontrack = null;
    peerConnectionRef.current.onicecandidate = null;
    peerConnectionRef.current.onnegotiationneeded = null;
    peerConnectionRef.current.onremovetrack = null;
    peerConnectionRef.current.oniceconnectionstatechange = null;

    peerConnectionRef.current.close();
    peerConnectionRef.current = null;

    remoteUserRef.current = null;
  }

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

    handleCloseConnection(remoteUserRef.current);
  }

  function handleRoomLeave() {
    history.push('/');
  }

  return (
    <div className="sm:mt-40">
      <h2 className="m-2">{roomName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
        <video
          className="w-full max-w-full"
          ref={localVideoRef}
          muted
          autoPlay
        />
        <video className="w-full max-w-full" ref={remoteVideoRef} autoPlay />
      </div>

      <button
        className="m-2 rounded bg-red-500 text-white py-2 px-4"
        onClick={handleRoomLeave}
      >
        Leave Room
      </button>
    </div>
  );
}

export default Meeting;
