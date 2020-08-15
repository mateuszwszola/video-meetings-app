import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { initiateSocket, disconnectSocket } from 'utils/socket';
import { openUserMedia } from 'utils/webrtc';
import { peerConfiguration } from 'config';
import Video from 'pages/meeting/Video';

function Meeting() {
  const { roomName } = useParams();
  const history = useHistory();
  const socketRef = useRef(null);
  const localMediaStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const [peerConnections, setPeerConnections] = useState([]);

  useEffect(() => {
    const socket = initiateSocket();

    openUserMedia()
      .then((mediaStream) => {
        localMediaStreamRef.current = mediaStream;
        localVideoRef.current.srcObject = mediaStream;

        socket.emit('JOIN_ROOM', { room: roomName });

        socket.on('RECIPIENT', (recipientsIds) => {
          console.log('RECIPIENT triggered', recipientsIds);
          callUsers(recipientsIds);
        });

        socket.on('OWNER', () => {
          console.log('OWNER event triggered');
        });

        socket.on('USER_JOINED', (userId) => {
          console.log(`USER_JOINED event triggered for ${userId}`);
        });

        socket.on('USER_DISCONNECTED', (userId) => {
          console.log(`USER_DISCONNECTED event triggered for ${userId}`);
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

  function callUsers(remoteUsersIds) {
    const peers = [];

    const localTracks = localMediaStreamRef.current.getTracks();

    remoteUsersIds.forEach((userId) => {
      const peer = createPeerConnection(userId);

      try {
        localTracks.forEach((track) =>
          peer.addTrack(track, localMediaStreamRef.current)
        );
      } catch (err) {
        handleGetUserMediaError(err);
      }

      peerConnectionsRef.current[userId] = peer;
      peers.push(peer);
    });

    setPeerConnections(peers);
  }

  function createPeerConnection(userId) {
    const peer = new RTCPeerConnection(peerConfiguration);

    peer.onicecandidate = (e) => handleICECandidateEvent(e, userId);
    peer.onnegotiationneeded = (e) => handleNegotiationNeededEvent(e, userId);

    peer.onremovetrack = (e) => handleRemoveTrackEvent(e, userId);
    peer.oniceconnectionstatechange = (e) =>
      handleICEConnectionStateChangeEvent(e, userId);

    return peer;
  }

  async function handleNegotiationNeededEvent(e, userId) {
    if (!peerConnectionsRef.current[userId]) return;

    try {
      const offer = await peerConnectionsRef.current[userId].createOffer();

      if (peerConnectionsRef.current[userId].signalingState !== 'stable') {
        return;
      }

      await peerConnectionsRef.current[userId].setLocalDescription(offer);

      socketRef.current.emit('OFFER', {
        target: userId,
        caller: socketRef.current.id,
        sdp: peerConnectionsRef.current[userId].localDescription,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleICECandidateEvent(e, userId) {
    if (e.candidate) {
      socketRef.current.emit('NEW_ICE_CANDIDATE', {
        target: userId,
        caller: socketRef.current.id,
        candidate: e.candidate,
      });
    }
  }

  function handleRemoveTrackEvent(e, userId) {
    // const mediaTracks =
    //   peerConnectionsRef.current[userId] &&
    //   peerConnectionsRef.current[userId].getTracks();
    // if (mediaTracks && mediaTracks.length === 0) {
    //   handleCloseConnection(userId);
    // }
  }

  function handleICEConnectionStateChangeEvent(e, userId) {
    const currentState = peerConnectionsRef.current[userId].iceConnectionState;

    if (
      currentState === 'closed' ||
      currentState === 'failed' ||
      currentState === 'disconnected'
    ) {
      handleCloseConnection(userId);
    }
  }

  async function handleNewICECandidate(payload) {
    const candidate = new RTCIceCandidate(payload.candidate);
    await peerConnectionsRef.current[payload.caller]
      .addIceCandidate(candidate)
      .catch(console.error);
  }

  async function handleAnswerReceive(payload) {
    const desc = new RTCSessionDescription(payload.sdp);
    await peerConnectionsRef.current[payload.caller]
      .setRemoteDescription(desc)
      .catch(console.error);
  }

  async function handleOfferReceive(payload) {
    if (!peerConnectionsRef.current[payload.caller]) {
      const peer = createPeerConnection(payload.caller);
      peerConnectionsRef.current[payload.caller] = peer;
      setPeerConnections((prevState) => [...prevState, peer]);
    }

    const desc = new RTCSessionDescription(payload.sdp);

    await peerConnectionsRef.current[payload.caller].setRemoteDescription(desc);

    try {
      localMediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionsRef.current[payload.caller].addTrack(
            track,
            localMediaStreamRef.current
          )
        );
    } catch (err) {
      handleGetUserMediaError(err);
    }

    const answer = await peerConnectionsRef.current[
      payload.caller
    ].createAnswer();
    await peerConnectionsRef.current[payload.caller].setLocalDescription(
      answer
    );

    socketRef.current.emit('ANSWER', {
      target: payload.caller,
      caller: socketRef.current.id,
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

  function handleCloseConnection(userId) {
    if (!Array.isArray(userId)) {
      userId = [userId];
    }

    userId.forEach((id) => {
      if (!peerConnectionsRef.current[id]) return;

      peerConnectionsRef.current[id].ontrack = null;
      peerConnectionsRef.current[id].onicecandidate = null;
      peerConnectionsRef.current[id].onnegotiationneeded = null;
      peerConnectionsRef.current[id].onremovetrack = null;
      peerConnectionsRef.current[id].oniceconnectionstatechange = null;

      peerConnectionsRef.current[id].close();
      peerConnectionsRef.current[id] = null;
    });
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

    handleCloseConnection(peerConnections);
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
          playsInline
        />
        {peerConnections.map((peer, index) => (
          <Video key={index} peer={peer} />
        ))}
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
