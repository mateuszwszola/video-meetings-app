import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as roomClient from 'utils/room-client';
import urlify from 'utils/urlify';
import useRoom from 'hooks/useRoom';
import Loading from 'components/Loading';

const RoomForm = () => {
  const history = useHistory();
  const { state, dispatch } = useRoom();
  const [roomName, setRoomName] = useState(state?.roomName || '');
  const [identity, setIdentity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createRoom, setCreateRoom] = useState(!state?.roomName);

  const toggleEnterRoom = () => {
    setCreateRoom((prevState) => !prevState);
    setError(null);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
    if (error && error.roomName) {
      setError((e) => ({ ...e, roomName: '' }));
    }
  };

  const handleIdentityChange = (e) => {
    setIdentity(e.target.value);
    if (error && error.identity) {
      setError((e) => ({ ...e, identity: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomName || !identity) {
      return setError((e) => ({
        ...e,
        ...(!roomName ? { roomName: 'Room name is required' } : null),
        ...(!identity ? { identity: 'Display name is required' } : null),
      }));
    }

    setLoading(true);
    setError(null);

    const submit = createRoom ? roomClient.createRoom : roomClient.joinRoom;

    submit({ roomName, identity })
      .then((res) => {
        dispatch({ type: 'join_room', identity, roomName, token: res.token });
        history.push('/' + res.room.name);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-40">
          <Loading />
        </div>
      )}
      <div
        className={`mt-6 px-2 max-w-xs lg:max-w-sm w-full mx-auto ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {error?.message && (
          <div className="text-center py-2 text-sm font-semibold uppercase text-red-500 tracking-wide">
            {error.message}
          </div>
        )}
        <div className="h-6 mb-2">
          {createRoom && roomName && (
            <div className="h-full">
              <span className="font-semibold text-sm uppercase text-gray-500">
                Room name
              </span>
              : <span className="text-blue-500">{urlify(roomName)}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <label
            className="text-sm uppercase font-semibold tracking-wide text-gray-700"
            htmlFor="identity"
          >
            Display name:
          </label>
          <input
            disabled={loading}
            value={identity}
            onChange={handleIdentityChange}
            className={`w-full rounded py-2 px-4 bg-gray-100 border focus:outline-none focus:shadow-outline ${
              error && error.identity ? 'border-red-500' : 'border-gray-300'
            }`}
            type="text"
            id="identity"
            name="identity"
            placeholder="Enter your display name"
          />
          {error && error.identity && (
            <div className="w-full text-sm text-red-500">{error.identity}</div>
          )}
          <label
            className="block mt-2 text-sm uppercase font-semibold tracking-wide text-gray-700"
            htmlFor="roomName"
          >
            Room name
          </label>
          <input
            disabled={loading}
            value={roomName}
            onChange={handleRoomNameChange}
            className={`w-full rounded py-2 px-4 bg-gray-100 border focus:outline-none focus:shadow-outline ${
              error && error.roomName ? 'border-red-500' : 'border-gray-300'
            }`}
            type="text"
            id="roomName"
            name="roomName"
            placeholder="Enter the room name"
          />
          {error && error.roomName && (
            <div className="w-full text-sm text-red-500">{error.roomName}</div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="block mx-auto py-2 sm:py-3 px-4 sm:px-6 mt-4 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 focus:outline-none focus:shadow-outline text-white font-bold tracking-wider uppercase text-sm rounded-lg shadow-md"
          >
            {createRoom ? 'Create a room' : 'Join a room'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            {createRoom
              ? 'Already know a room name?'
              : 'Want to create a new room?'}
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={toggleEnterRoom}
            className="text-blue-500 font-medium hover:text-blue-400 focus:outline-none focus:text-blue-600"
          >
            {createRoom ? 'Join the room instead' : 'Create the room'}
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomForm;
