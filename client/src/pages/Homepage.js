import React from 'react';
import RoomForm from 'pages/homepage/RoomForm';
import Layout from 'components/Layout';

function Homepage(props) {
  return (
    <Layout>
      <div className="relative w-full flex flex-col justify-center items-center">
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
    </Layout>
  );
}

export default Homepage;
