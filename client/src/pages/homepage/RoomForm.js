import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as roomClient from 'utils/room-client';
import Loading from 'components/Loading';

const RoomForm = () => {
  const history = useHistory();
  const [createRoom, setCreateRoom] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleEnterRoom = () => {
    setCreateRoom((prevState) => !prevState);
    setError(null);
  };

  const handleRoomNameInputChange = (e) => {
    const { value } = e.target;
    setRoomName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomName) return;

    setLoading(true);
    setError(null);

    const submit = createRoom ? roomClient.createRoom : roomClient.getRoom;

    submit(roomName)
      .then((res) => {
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
        className={`mt-6 max-w-xs lg:max-w-sm w-full mx-auto ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {error && (
          <div className="text-center py-2 text-sm font-semibold uppercase text-red-500 tracking-wide">
            {error.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <label className="sr-only" htmlFor="roomName">
            {createRoom ? 'Create a room' : 'Join a room'}
          </label>
          <div className="flex flex-col w-full items-center px-2 max-w-screen-sm">
            <input
              disabled={loading}
              value={roomName}
              onChange={handleRoomNameInputChange}
              className="w-full rounded py-2 px-4 bg-gray-100 border border-gray-300 focus:outline-none focus:shadow-outline"
              type="text"
              id="roomName"
              name="roomName"
              placeholder="Enter the room name"
            />
            <div className="mx-auto mt-2">
              <button
                disabled={loading}
                type="submit"
                className="py-2 sm:py-3 px-4 sm:px-6 mt-4 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 focus:outline-none focus:shadow-outline text-white font-bold tracking-wider uppercase text-sm rounded-lg"
              >
                {createRoom ? 'Create a room' : 'Join a room'}
              </button>
            </div>
          </div>
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
