import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.output.css';
import 'webrtc-adapter';
import App from './App';
import { RoomProvider } from 'hooks/useRoom';

ReactDOM.render(
  <React.StrictMode>
    <RoomProvider>
      <App />
    </RoomProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
