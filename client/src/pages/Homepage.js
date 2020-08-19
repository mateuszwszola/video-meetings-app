import React from 'react';
import RoomForm from 'pages/homepage/RoomForm';

function Homepage(props) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div>
        <h1 className="font-mono text-4xl lg:text-5xl text-center font-semibold leading-tight">
          Videoma
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg text-center">
          Video Meetings App
        </p>
      </div>
      <RoomForm />
    </div>
  );
}

export default Homepage;
