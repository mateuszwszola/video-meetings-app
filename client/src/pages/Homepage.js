import React from 'react';
import Layout from 'components/Layout';
import RoomForm from 'pages/homepage/RoomForm';

function Homepage(props) {
  return (
    <div>
      <Layout>
        <h1>Video Meetings App</h1>
        <RoomForm />
      </Layout>
    </div>
  );
}

export default Homepage;
