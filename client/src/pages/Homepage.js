import React from 'react';
import Layout from 'components/Layout';
import RoomForm from 'pages/homepage/RoomForm';

function Homepage(props) {
  return (
    <Layout>
      <div className="mt-8">
        <h1 className="text-3xl text-center font-semibold">Videoma</h1>
        <p className="text-gray-600 text-sm text-center">Video Meetings App</p>
      </div>
      <RoomForm />
    </Layout>
  );
}

export default Homepage;
