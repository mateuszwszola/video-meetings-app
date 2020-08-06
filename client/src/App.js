import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Homepage from 'pages/Homepage';

const ENDPOINT = 'http://127.0.0.1:3001';

function App() {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('PULSE', (msg) => {
      console.log(msg);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return <Homepage />;
}

export default App;
