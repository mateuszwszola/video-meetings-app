import React, { useState } from 'react';

const RoomForm = () => {
  const [createRoom, setCreateRoom] = useState(true);

  const toggleEnterRoom = () => setCreateRoom((prevState) => !prevState);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('The form has been submitted');
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <label className="sr-only" htmlFor="roomName">
          {createRoom ? 'Create a room' : 'Join a room'}
        </label>
        <div className="flex flex-col w-full items-center px-2 max-w-screen-sm">
          <input
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
