import React from 'react';
import Layout from 'components/Layout';
import RoomForm from 'pages/homepage/RoomForm';

function Homepage(props) {
  return (
    <Layout>
      <div className="flex flex-col flex-1 justify-center items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl text-center font-semibold">
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
