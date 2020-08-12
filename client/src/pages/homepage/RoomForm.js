import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const RoomForm = () => {
  const [createRoom, setCreateRoom] = useState(true);
  const [roomName, setRoomName] = useState('');
  const history = useHistory();

  const toggleEnterRoom = () => setCreateRoom((prevState) => !prevState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!createRoom) return;
    history.push('/' + roomName);
  };

  return (
    <div className="mt-16 max-w-xs lg:max-w-sm w-full mx-auto">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <label className="sr-only" htmlFor="roomName">
          {createRoom ? 'Create a room' : 'Join a room'}
        </label>
        <div className="flex flex-col w-full items-center px-2 max-w-screen-sm">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full rounded py-2 px-4 bg-gray-100 border border-gray-300"
            type="text"
            id="roomName"
            name="roomName"
            placeholder="Enter the room name"
          />
          <button
            type="submit"
            className="py-2 px-6 mt-4 bg-blue-500 hover:bg-blue-600 text-blue-100 font-medium tracking-wide uppercase text-sm rounded block mx-auto"
          >
            {createRoom ? 'Create a room' : 'Join a room'}
          </button>
        </div>

        <div className="text-center mt-4">
          {createRoom ? (
            <>
              <p>Already know the room name?</p>
              <button onClick={toggleEnterRoom} className="text-blue-500">
                Join the room instead
              </button>
            </>
          ) : (
            <button onClick={toggleEnterRoom} className="text-blue-500">
              Create the room
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
