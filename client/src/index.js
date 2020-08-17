import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.output.css';
import 'webrtc-adapter';
import App from './App';
import { AuthProvider } from 'context/authContext';
import { UserProvider } from 'context/userContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
