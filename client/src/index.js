import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.output.css';
import 'webrtc-adapter';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './config';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      redirectUri={window.location.origin}
      audience={auth0Config.audience}
      scope={auth0Config.scope}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
